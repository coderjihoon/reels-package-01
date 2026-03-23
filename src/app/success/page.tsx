"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      // URL에서 결제 정보 추출
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      if (!paymentKey || !orderId || !amount) {
        setStatus("error");
        setErrorMessage("결제 정보가 올바르지 않습니다.");
        return;
      }

      try {
        // 자체 백엔드 API로 결제 승인 요청
        const response = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus("success");
          if (data.downloadLink) {
            setDownloadLink(data.downloadLink);
          }
        } else {
          setStatus("error");
          setErrorMessage(data.message || "결제 승인에 실패했습니다.");
        }
      } catch (err) {
        console.error("Confirm error:", err);
        setStatus("error");
        setErrorMessage("결제 처리 중 서버 에러가 발생했습니다.");
      }
    };

    confirmPayment();
  }, [searchParams]);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 max-w-md w-full text-center">
      
      {/* 로딩 중 (결제 승인 대기) */}
      {status === "loading" && (
        <div className="flex flex-col items-center py-8">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">결제 승인 중...</h1>
          <p className="text-slate-500">안전하게 결제를 완료하고 있습니다.<br/>잠시만 기다려 주세요.</p>
        </div>
      )}

      {/* 결제 성공 */}
      {status === "success" && (
        <>
          <div className="flex justify-center mb-6 mt-4">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">결제 성공!</h1>
          <p className="text-slate-600 mb-6 leading-relaxed">
            5,000+ 영상 PLR 패키지 결제가 완료되었습니다.<br/>
            <strong>아래 버튼을 눌러 파일을 즉시 다운로드하세요.</strong>
          </p>
          
          {/* 다운로드 영역 */}
          {downloadLink && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
              <a href={downloadLink} download="plr-package-5000.zip">
                <Button className="w-full bg-[#3182f6] hover:bg-[#2b72d6] text-white h-12 shadow-md">
                  파일 즉시 다운로드 (.zip)
                </Button>
              </a>
            </div>
          )}

          <Link href="/">
            <Button variant="outline" className="w-full text-slate-600 border-slate-200 h-12 hover:bg-slate-50">
              메인으로 돌아가기
            </Button>
          </Link>
        </>
      )}

      {/* 결제 승인 실패 */}
      {status === "error" && (
        <>
          <div className="flex justify-center mb-6 mt-4">
            <div className="bg-red-100 p-4 rounded-full">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">결제 실패</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            {errorMessage}
          </p>
          <Link href="/">
            <Button variant="outline" className="w-full h-12 border-slate-200">
              메인으로 돌아가기
            </Button>
          </Link>
        </>
      )}
      
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Suspense fallback={
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 max-w-md w-full text-center flex flex-col items-center py-16">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <h1 className="text-2xl font-bold text-slate-900">결제 정보 확인 중...</h1>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
