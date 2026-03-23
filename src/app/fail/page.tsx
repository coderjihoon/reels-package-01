import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function FailPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">결제 실패</h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          결제 진행 중 오류가 발생했습니다.<br/>
          잠시 후 다시 시도해 주세요.
        </p>
        <Link href="/">
          <Button variant="outline" className="w-full h-12 border-slate-200">
            메인으로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  );
}