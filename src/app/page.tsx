"use client";

import { useState, useEffect, useRef } from "react";
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Clock, PlaySquare, TrendingUp, Download, CheckCircle, Youtube, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentWidget, setPaymentWidget] = useState<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<PaymentWidgetInstance["renderPaymentMethods"]> | null>(null);
  const [price, setPrice] = useState(50000);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
  const customerKey = "lMFsftZj_6_dYqQmAwrGn";

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 토스 결제위젯 초기화 및 렌더링
  useEffect(() => {
    if (!isPaymentModalOpen) return;

    (async () => {
      try {
        const widget = await loadPaymentWidget(clientKey, customerKey);
        setPaymentWidget(widget);

        // 결제 UI 렌더링
        const paymentMethodsWidget = widget.renderPaymentMethods(
          "#payment-method",
          { value: price },
          { variantKey: "DEFAULT" }
        );
        paymentMethodsWidgetRef.current = paymentMethodsWidget;

        // 이용약관 UI 렌더링
        widget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });
      } catch (error) {
        console.error("결제 위젯 렌더링 실패:", error);
      }
    })();
  }, [isPaymentModalOpen]);

  // 쿠폰 적용에 따른 금액 업데이트
  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;
    if (paymentMethodsWidget == null) return;

    const currentPrice = isCouponApplied ? price - 5000 : price;
    paymentMethodsWidget.updateAmount(currentPrice);
  }, [price, isCouponApplied]);

  const handlePaymentRequest = async () => {
    try {
      if (!paymentWidget) return;

      await paymentWidget.requestPayment({
        orderId: `order_${Math.random().toString(36).substring(2, 11)}`, // 랜덤 주문번호
        orderName: "5,000+ 영상 PLR 패키지",
        successUrl: window.location.origin + "/success",
        failUrl: window.location.origin + "/fail",
        customerEmail: "customer123@gmail.com",
        customerName: "김토스",
        customerMobilePhone: "01012341234",
      });
    } catch (error) {
      console.error("결제 요청 실패:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      
      {/* --- Section 1: Hero --- */}
      <section className="relative px-6 py-24 md:py-32 flex flex-col items-center text-center bg-white overflow-hidden">
        <div className="absolute inset-0 bg-blue-50/50 -z-10 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge variant="secondary" className="text-blue-700 bg-blue-100 hover:bg-blue-100 flex items-center gap-1 text-sm py-1 px-3">
              <ShieldCheck className="w-4 h-4" /> 100% 저작권 프리
            </Badge>
            <Badge variant="secondary" className="text-blue-700 bg-blue-100 hover:bg-blue-100 flex items-center gap-1 text-sm py-1 px-3">
              <TrendingUp className="w-4 h-4" /> PLR/MRR 라이선스 포함
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            얼굴 노출 없이, 저작권 걱정 없이. <br className="hidden md:block"/>
            <span className="text-blue-600">하루 10분으로 끝내는 숏폼 수익화</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            5,000개 이상의 고퀄리티 영상 소스를 내 것처럼 사용하고, <br className="hidden sm:block"/>
            패키지 자체를 재판매하여 100% 마진을 남기세요.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg h-14 px-8 shadow-lg shadow-blue-200" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
              [기간 한정] 특가로 구매하기
            </Button>
          </div>
        </div>
      </section>

      {/* --- Section 2: Problem --- */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <h2 className="text-3xl md:text-4xl font-bold">
            아직도 15초 영상 하나 만들려고 <br className="hidden sm:block"/>
            <span className="text-blue-600 underline decoration-blue-200 decoration-8 underline-offset-[-4px]">3시간씩 검색</span>하시나요?
          </h2>
          <div className="grid gap-4 mt-8">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-start gap-4 text-left">
                <div className="bg-red-50 p-2 rounded-full mt-1">
                  <Clock className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">무료 소스 찾다가 버리는 아까운 시간</h3>
                  <p className="text-slate-500 mt-1">픽사베이, 펙셀스... 매일 똑같은 영상을 찾기 위해 낭비되는 시간이 너무 많습니다.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-start gap-4 text-left">
                <div className="bg-red-50 p-2 rounded-full mt-1">
                  <ShieldCheck className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">언제 터질지 모르는 저작권 침해 경고</h3>
                  <p className="text-slate-500 mt-1">무료라고 해서 썼는데, 알고 보니 저작권 문제가 있는 영상이라 채널이 통째로 날아갈까 불안합니다.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-start gap-4 text-left">
                <div className="bg-red-50 p-2 rounded-full mt-1">
                  <Youtube className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">조회수는 안 나오고 얼굴 노출은 부담스러운 현실</h3>
                  <p className="text-slate-500 mt-1">얼굴을 드러내지 않으면 콘텐츠 퀄리티를 높이기 어려워 수익화의 벽에 부딪힙니다.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* --- Section 3: Solution & Concept --- */}
      <section className="px-6 py-24 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            영상을 올리는 것만으로 끝이 아닙니다. <br />
            이제 <span className="text-blue-300">"판매자"</span>가 되세요.
          </h2>
          <p className="text-blue-100 text-lg md:text-xl">
            단순한 영상 제공을 넘어, 당신에게 마스터 권한을 드립니다.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-left mt-12">
            <div className="bg-blue-800/50 p-8 rounded-2xl border border-blue-700/50 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-blue-200 flex items-center gap-2 mb-4">
                <PlaySquare className="w-6 h-6" /> PLR
                <span className="text-sm font-normal text-blue-300 ml-2">(Private Label Rights)</span>
              </h3>
              <p className="text-blue-50 leading-relaxed">
                제공된 5,000+ 영상을 <strong className="text-white">자유롭게 편집하고 내 채널에 업로드</strong>하여 쇼츠, 릴스, 틱톡에서 광고 수익 및 스폰서십 수익을 창출할 수 있는 권리입니다.
              </p>
            </div>
            <div className="bg-blue-800/50 p-8 rounded-2xl border border-blue-700/50 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-blue-200 flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6" /> MRR
                <span className="text-sm font-normal text-blue-300 ml-2">(Master Resell Rights)</span>
              </h3>
              <p className="text-blue-50 leading-relaxed">
                이 영상 패키지 자체를 다른 사람에게 <strong className="text-white">당신의 마진 100%로 다시 판매</strong>할 수 있는 마스터 권한입니다. 판매금 전액이 당신의 계좌로 입금됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 4: Features --- */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">단 한 번의 결제로 얻게 되는 <br className="sm:hidden" /> 압도적 스케일</h2>
            <p className="text-slate-600 text-lg">5,000개가 넘는 영상이 꼼꼼하게 분류되어 있습니다.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['🌿 자연/풍경', '💼 비즈니스/오피스', '☕ 라이프스타일', '🔥 동기부여/명언', '✈️ 여행/도시', '🏃 피트니스/건강', '🐶 동물/펫', '✨ 감성/추상'].map((category, i) => (
              <Card key={i} className="bg-slate-50 border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <span className="font-semibold text-slate-800">{category}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-blue-900 mb-2">🎁 구매자 한정 특별 혜택</h3>
            <p className="text-blue-700 mb-6">어떻게 시작해야 할지 막막하신가요? 구매자 전원에게 <strong>1:1 수익화 가이드</strong>를 제공합니다.</p>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">1:1 상담 혜택 자세히 보기</Button>
          </div>
        </div>
      </section>

      {/* --- Section 5: Process --- */}
      <section className="px-6 py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">이렇게 활용하세요</h2>
            <p className="text-slate-600 text-lg">결제부터 수익 창출까지, 단 3단계면 충분합니다.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center bg-slate-50 pt-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-blue-200 ring-8 ring-slate-50">1</div>
              <h3 className="text-xl font-bold mb-2">다운로드</h3>
              <p className="text-slate-600">결제 즉시 5,000+ 영상 소스 원본 접근 권한을 획득합니다.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center bg-slate-50 pt-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-blue-200 ring-8 ring-slate-50">2</div>
              <h3 className="text-xl font-bold mb-2">콘텐츠 업로드</h3>
              <p className="text-slate-600">내 입맛대로 편집하여 유튜브/틱톡/인스타그램에 업로드하고 트래픽을 확보합니다.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center bg-slate-50 pt-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-blue-200 ring-8 ring-slate-50">3</div>
              <h3 className="text-xl font-bold mb-2">재판매 셋업</h3>
              <p className="text-slate-600">제공된 가이드를 따라 패키지 자체를 판매하여 추가 수익(100% 마진)을 창출합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 6: FAQ --- */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">자주 묻는 질문</h2>
          <Accordion className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-lg font-semibold">진짜로 제가 다시 팔아도 되나요?</AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base leading-relaxed">
                네, 그렇습니다! 본 패키지에는 MRR(Master Resell Rights) 라이선스가 포함되어 있어, 구매하신 후 원하시는 가격에 재판매가 가능하며 수익의 100%를 가져가실 수 있습니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-lg font-semibold">유튜브 수익 창출 승인에 문제가 없나요?</AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base leading-relaxed">
                제공해 드리는 영상은 100% 저작권 프리 소스입니다. 다만 유튜브 정책상 '재사용된 콘텐츠'로 분류되지 않기 위해 음악, 자막, 더빙 등 본인만의 가치를 약간 더해 편집하시는 것을 권장합니다. 이에 대한 노하우도 가이드에서 제공해 드립니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-lg font-semibold">초보자도 할 수 있나요? 영상 편집을 한 번도 안 해봤어요.</AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base leading-relaxed">
                물론입니다! 스마트폰 무료 앱(CapCut, VLLO 등)으로 몇 번의 터치만으로 완성할 수 있습니다. 어떻게 시작해야 할지 모르는 분들을 위해 구매자 한정 1:1 수익화 가이드 상담을 지원해 드리고 있으니 걱정하지 않으셔도 됩니다.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* --- Section 7: Final CTA (Pricing) --- */}
      <section id="pricing" className="px-6 py-24 bg-blue-50 border-t border-blue-100">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
            지금 바로 당신만의 <br className="hidden sm:block"/>
            <span className="text-blue-600">자동화 수익 파이프라인</span>을 구축하세요
          </h2>
          
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-100 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            
            <div className="flex flex-col items-center mb-8">
              <span className="text-sm font-bold tracking-wider text-red-500 bg-red-50 px-4 py-1.5 rounded-full mb-4 animate-pulse">
                ⏳ 3/31 한정 특가 마감까지
              </span>
              <div className="flex gap-4 text-3xl md:text-4xl font-mono font-bold text-slate-800">
                <div className="flex flex-col items-center">
                  <span className="bg-slate-100 px-3 py-2 rounded-lg min-w-[70px]">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-xs text-slate-400 mt-2 font-sans font-medium">시간</span>
                </div>
                <span className="mt-2">:</span>
                <div className="flex flex-col items-center">
                  <span className="bg-slate-100 px-3 py-2 rounded-lg min-w-[70px]">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-xs text-slate-400 mt-2 font-sans font-medium">분</span>
                </div>
                <span className="mt-2">:</span>
                <div className="flex flex-col items-center">
                  <span className="bg-slate-100 px-3 py-2 rounded-lg min-w-[70px]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-xs text-slate-400 mt-2 font-sans font-medium">초</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <p className="text-slate-400 line-through text-lg">정가 50,000원</p>
              <div className="text-5xl font-extrabold text-slate-900">
                45,000<span className="text-2xl font-bold text-slate-500">원</span>
              </div>
              <p className="text-orange-500 font-semibold mt-2 flex items-center justify-center gap-1">
                ✨ 기존 구매자 전용 특별 추가 할인 혜택 적용 중!
              </p>
            </div>

            {/* 결제 모달 열기 버튼 */}
            <Button 
              size="lg" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg h-16 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              지금 바로 5,000개 영상 팩 다운로드하기
            </Button>
            <p className="text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
              <CheckCircle className="w-3 h-3" /> 결제 즉시 이메일로 다운로드 링크가 발송됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm bg-white border-t border-slate-100">
        <p>© 2024 Video PLR Package. All rights reserved.</p>
      </footer>

      {/* 토스페이먼츠 결제 모달 (Dialog) */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>안전한 결제</DialogTitle>
            <DialogDescription>
              토스페이먼츠를 통해 안전하게 결제가 진행됩니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 space-y-4">
            {/* 할인 쿠폰 */}
            <div className="flex items-center gap-2 mb-4 p-4 bg-slate-50 rounded-lg border">
              <input 
                type="checkbox" 
                id="coupon-box" 
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                checked={isCouponApplied}
                onChange={(e) => setIsCouponApplied(e.target.checked)}
              />
              <label htmlFor="coupon-box" className="font-medium text-slate-700 cursor-pointer">
                5,000원 특별 할인 쿠폰 적용
              </label>
            </div>

            {/* 토스 결제 위젯이 렌더링될 DOM 요소 */}
            <div id="payment-method" className="w-full"></div>
            <div id="agreement" className="w-full"></div>

            {/* 결제 요청 버튼 */}
            <Button 
              size="lg" 
              className="w-full bg-[#3182f6] hover:bg-[#2b72d6] text-white text-lg h-14 mt-4"
              onClick={handlePaymentRequest}
            >
              {(isCouponApplied ? price - 5000 : price).toLocaleString()}원 결제하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
