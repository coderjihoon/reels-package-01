"use client";

import { useState, useEffect, useRef } from "react";
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Clock,
  CheckCircle,
  ShieldCheck,
  Check,
  Zap,
  Gift,
  TrendingUp,
  Share2,
  RefreshCcw,
  Layers,
  ShieldAlert,
  FileX,
} from "lucide-react";

export default function LandingPage() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentWidget, setPaymentWidget] = useState<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<PaymentWidgetInstance["renderPaymentMethods"]> | null>(null);
  const price = 30000;

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
  const customerKey = "lMFsftZj_6_dYqQmAwrGn";

  const [activeTab, setActiveTab] = useState("intro");

  // Intersection Observer for scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0.1 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // 토스 결제위젯 초기화 및 렌더링
  useEffect(() => {
    if (!isPaymentModalOpen) return;

    (async () => {
      try {
        const widget = await loadPaymentWidget(clientKey, customerKey);
        setPaymentWidget(widget);

        const paymentMethodsWidget = widget.renderPaymentMethods(
          "#payment-method",
          { value: price },
          { variantKey: "DEFAULT" }
        );
        paymentMethodsWidgetRef.current = paymentMethodsWidget;

        widget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });
      } catch (error) {
        console.error("결제 위젯 렌더링 실패:", error);
      }
    })();
  }, [isPaymentModalOpen, clientKey, price]);

  const handlePaymentRequest = async () => {
    try {
      if (!paymentWidget) return;

      await paymentWidget.requestPayment({
        orderId: `order_${Math.random().toString(36).substring(2, 11)}`,
        orderName: "조회수가 보장된 영상 패키지 (구매자 전용)",
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

  const tabs = [
    { id: "problem", label: "상세설명" },
    { id: "body", label: "수익구조" },
    { id: "cta", label: "프리미엄 혜택" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24 lg:pb-0">
      <div className="sticky top-0 z-50 border-b border-blue-500 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 shadow-md backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-1.5 md:py-2 flex items-center justify-center">
          <img
            src="/BARODE_logo_final.png"
            alt="Video PLR 로고"
            loading="eager"
            className="h-7 md:h-8 w-auto"
          />
        </div>
      </div>
      <div className="w-full bg-white border-b border-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white pointer-events-none"></div>
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto p-8 md:p-16 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          
          {/* Left Text Area */}
          <div className="order-2 lg:order-none w-full lg:w-1/2 flex flex-col items-start text-left">
            <div className="flex flex-wrap justify-start gap-3 mb-3">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-4 py-1.5 text-sm md:text-base border-none shadow-none">
                # 얼굴노출 없는
              </Badge>
              <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 px-4 py-1.5 text-sm md:text-base border-none shadow-none">
                # 100% 저작권 프리
              </Badge>
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 px-4 py-1.5 text-sm md:text-base border-none shadow-none">
                # 재판매 권한(MRR) 포함
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mt-4 mb-6">
              이 패키지 하나로 <br className="block md:hidden" />
              <br className="hidden md:block" />
              <span className="text-blue-600">
                쇼츠/틱톡/릴스/
                개인 프로젝트
              </span>{" "}
              <br className="hidden md:block" />
              모두 사용 가능!
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 font-medium">
              요즘 많은 사람들이 하는 영상 부업. <br />
              조회수가 보장된 영상들로 남들보다 <br />
              한발 앞서가세요.
            </p>
          </div>
          
          {/* Right Image Area */}
          <div className="order-1 lg:order-none mt-6 lg:mt-0 w-full lg:w-1/2 flex justify-center lg:justify-end lg:self-start">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Using a placeholder image related to video/social media */}
                <img 
                  src="/hero.png" 
                  alt="영상 편집 패키지 예시" 
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              <div className="absolute bottom-3 left-6 right-6">
                <Badge className="bg-white/90 text-blue-700 hover:bg-white px-4 py-2.5 mb-2 backdrop-blur-sm border-none shadow-sm font-bold h-auto">
                  5,000+ 영상 소스
                </Badge>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 lg:flex lg:gap-8 lg:items-start">
        
        {/* Left Content Area (Main) */}
        <div className="lg:w-2/3 w-full">

          {/* Sticky Tab Navigation */}
          <div className="sticky top-[36px] md:top-[40px] z-40 bg-white border border-slate-200 flex overflow-x-auto scrollbar-hide shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  scrollToSection(tab.id);
                }}
                className={`flex-1 min-w-[80px] py-4 text-sm md:text-base font-bold text-center border-b-2 transition-colors whitespace-nowrap px-4 ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 bg-blue-50/30"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Sections */}
          <div className="bg-white border-b border-x border-slate-200 rounded-b-2xl p-6 md:p-10 space-y-24 shadow-sm">

            {/* Section: Problem & Agitation */}
            <section id="problem" className="scroll-mt-32 space-y-10 pt-10 md:pt-16">
              <div className="text-center space-y-4">
                <span className="inline-block bg-blue-50 text-blue-600 border border-blue-200 font-bold tracking-wider text-sm px-3 py-1 rounded-full">PROBLEM</span>
                <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                  남들 다 하는 쇼츠 부업,<br />
                  <span className="text-slate-500">왜 나만 제자리일까요?</span>
                </h2>
              </div>
              
              <div className="grid gap-4 mt-8">
                {[
                  { text: "영상 하나 만들 때마다 쓸만한 소스 찾느라 버리는 수 시간", icon: Clock },
                  { text: "무료 영상의 낮은 퀄리티와 늘 불안한 저작권 문제", icon: ShieldAlert },
                  { text: "내 프로젝트에 딱 맞는 '감도 높은' 영상의 부재", icon: FileX }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <div className="bg-red-50 p-2 rounded-full shrink-0">
                      <item.icon className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-slate-700 font-medium md:text-lg leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                <p className="text-blue-900 font-bold text-lg md:text-xl">
                  이제 찾지 말고, <br className="md:hidden" />
                  <span className="text-blue-600">5,000개 이상의 퀄리티 높은 영상</span>을 받아보세요.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section: Solution */}
            <section id="solution" className="scroll-mt-32 space-y-12">
              <div className="text-center space-y-4">
                <span className="inline-block bg-blue-50 text-blue-600 border border-blue-200 font-bold tracking-wider text-sm px-3 py-1 rounded-full">SOLUTION</span>
                <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                  얼굴 노출 없이, 저작권 걱정 없이.<br />
                  <span className="text-blue-600">이 패키지 하나로 <br />쇼츠/릴스/틱톡 평생 해결</span>
                </h2>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-10"></div>
                <div className="relative bg-white border border-blue-100 p-8 rounded-2xl shadow-sm text-center overflow-hidden">
                  <div className="mb-8 overflow-hidden max-w-[220px] md:max-w-[260px] mx-auto">
                    <video
                      src="/video-01.mp4"
                      aria-label="Solution Illustration"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-auto rounded-xl"
                    />
                  </div>
                  <p className="text-lg md:text-xl text-slate-700 font-medium leading-relaxed">
                    조회수가 보장된 <span className="text-blue-600 font-bold">고퀄리티 영상 소스들</span>로 <br className="hidden md:block" />
                    남들보다 <span className="bg-yellow-100 px-1 font-bold text-slate-900">10배 빠르게</span> 앞서가세요.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section: Body (Profit & Composition) */}
            <section id="body" className="scroll-mt-32 space-y-16">
              <div className="text-center space-y-4">
                <span className="inline-block bg-blue-50 text-blue-600 border border-blue-200 font-bold tracking-wider text-sm px-3 py-1 rounded-full">BODY</span>
                <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                  어떻게 수익을 내나요?
                </h2>
              </div>

              <div className="space-y-16">
                {/* 01. Revenue Models */}
                <div className="space-y-8">
                  <h3 className="text-xl md:text-2xl font-bold flex items-center gap-3">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm leading-none shrink-0">01</span>
                    이 패키지로 만드는 3가지 수익 모델
                  </h3>
                  
                  <div className="grid gap-6 md:grid-cols-3">
                    {[
                      { 
                        title: "채널 성장", 
                        desc: "단순 업로드만으로 조회수 폭발! 광고 수익(AdSense) 창출",
                        icon: TrendingUp
                      },
                      { 
                        title: "콘텐츠 활용", 
                        desc: "저작권 프리 소스로 개인 프로젝트 및 기업 SNS 대행 활용",
                        icon: Share2
                      },
                      { 
                        title: "권한 재판매 (PLR/MRR)", 
                        desc: "패키지 전체를 내 이름으로 재판매하여 판매 수익 100% 소유",
                        icon: RefreshCcw
                      }
                    ].map((item, i) => (
                      <div key={i} className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                          <item.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="text-lg font-bold mb-3">{item.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 02. Composition */}
                <div className="space-y-8">
                  <h3 className="text-xl md:text-2xl font-bold flex items-center gap-3">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm leading-none shrink-0">02</span>
                    압도적인 구성 (5,000+ Clips)
                  </h3>
                  
                  <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Layers className="w-48 h-48" />
                    </div>
                    
                    <div className="relative z-10 grid gap-8 md:grid-cols-2 lg:items-center">
                      <div className="space-y-6">
                        <p className="text-blue-400 font-bold tracking-wide">CATEGORIES</p>
                        <div className="flex flex-wrap gap-2">
                          {['자기계발', '럭셔리', '동기부여', 'AI ASMR', '애니메이션', '그래픽', '동물', '해외 밈', '시티뷰', '여행'].map((cat, i) => (
                            <span key={i} className="bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm font-medium">
                              {cat}
                            </span>
                          ))}
                          <span className="bg-blue-600 px-4 py-2 rounded-xl text-sm font-bold">+ 5000...</span>
                        </div>
                      </div>
                      
                      <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-2xl">
                        <p className="text-xl font-bold mb-4 leading-relaxed text-blue-400">
                          수익화에 최적화된 <br />
                          수백 가지 카테고리의 <br />
                          <span className="text-white">풀 패키지 구성</span>
                        </p>
                        <p className="text-slate-400 text-sm">
                          모든 영상은 SNS 환경에 최적화된 세로형(9:16) 고품질 소스로 구성되어 있습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section: Advantage (Social Proof) */}
            <section id="advantage" className="scroll-mt-32 space-y-12">
              <div className="text-center space-y-4">
                <span className="inline-block bg-blue-50 text-blue-600 border border-blue-200 font-bold tracking-wider text-sm px-3 py-1 rounded-full">ADVANTAGE</span>
                <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                  이미 해외 셀러들은 이 방식으로<br />
                  <span className="text-blue-600">월 수천 달러를 벌고 있습니다.</span>
                </h2>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 opacity-[0.03] rotate-12">
                  <TrendingUp className="w-64 h-64" />
                </div>

                <div className="relative z-10 space-y-8 max-w-3xl mx-auto text-center">
                  <div className="max-w-[260px] mx-auto overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-black mb-6">
                    <video
                      src="/video-02.mp4"
                      aria-label="Video 02"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-auto block"
                    />
                  </div>

                  <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
                    한국에선 아직 생소한 <span className="text-blue-600 font-bold underline underline-offset-4 decoration-blue-200">라이선스(PLR, MRR)</span> 개념입니다. <br className="hidden md:block" />
                    누구나 파는 물건이 아닌 <strong className="text-slate-900">&apos;블루오션&apos;</strong>일 때 선점하세요.
                  </p>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-slate-500">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>희소성 있는 고퀄리티 소스</span>
                    </div>
                    <div className="hidden md:block w-1 h-1 bg-slate-300 rounded-full"></div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>세팅만으로 자동 수익화 실현</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="inline-block bg-white px-6 py-3 rounded-2xl border border-blue-100 shadow-sm">
                      <p className="text-blue-700 font-bold">
                        전 세계에서 유행하는 이 수익구조, 지금 바로 시작하세요.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section: Target & Benefit */}
            <section id="target" className="scroll-mt-32 space-y-12">
              <div className="text-center space-y-4">
                <span className="inline-block bg-blue-50 text-blue-600 border border-blue-200 font-bold tracking-wider text-sm px-3 py-1 rounded-full">TARGET & BENEFIT</span>
                <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                  이런 분들께 추천드립니다.
                </h2>
              </div>

              <div className="flex flex-col gap-6 max-w-3xl mx-auto">
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-6">
                  <ul className="space-y-4">
                    {[
                      "얼굴 노출 없이 SNS 수익을 만들고 싶은 분",
                      "영상 소스 찾는 시간에 진을 다 빼는 영상 편집자",
                      "고퀄리티 콘텐츠를 만들고 싶지만 제작 능력이 부족한 분"
                    ].map((text, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                        <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section: Final CTA */}
            <section id="cta" className="scroll-mt-32 space-y-12">
              <div className="text-center space-y-6">
                <Badge className="bg-blue-600 text-white border-none px-4 h-auto py-2.5 text-sm font-bold animate-bounce my-4">
                  마지막 기회 🚀
                </Badge>
                <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                  &quot;남들이 고민하는 지금, <br />
                  여러분의 수익화가 시작됩니다.&quot;
                </h2>
                <p className="text-slate-600 md:text-lg max-w-2xl mx-auto leading-relaxed">
                  망설임은 수익화 시점만 늦출 뿐입니다. <br />
                  <span className="font-bold text-slate-900">5,000+개의 검증된 영상 소스</span>로 오늘부터 수익화를 시작하세요.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-8 md:p-12 lg:p-16 border border-slate-800 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <Badge className="bg-blue-600/30 text-blue-200 border border-blue-500/30 px-4 py-1.5 text-sm font-bold tracking-widest">
                      PREMIUM BENEFITS
                    </Badge>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold mb-12 text-center flex items-center justify-center gap-3">
                    <span>
                      구매자 한정
                      <br />
                      프리미엄 혜택 3가지
                    </span>
                  </h3>
                  <div className="flex flex-col gap-6 lg:gap-8 max-w-3xl mx-auto">
                    {[
                      { 
                        title: "초특가 할인", 
                        subtitle: "Special Price",
                        content: "런칭기념 할인가 적용 중(30,000원) \n추후 정상가(79,000원)로 인상 예정",
                        icon: Zap,
                        color: "text-yellow-600",
                        bgColor: "bg-yellow-100"
                      },
                      { 
                        title: "재판매 권한", 
                        subtitle: "MRR Rights",
                        content: "수정, 상업적 이용 가능 \n패키지 통째로 재판매 권한 즉시 부여",
                        icon: ShieldCheck,
                        color: "text-blue-600",
                        bgColor: "bg-blue-100"
                      },
                      { 
                        title: "SNS 최적화 소스", 
                        subtitle: "SNS Optimized",
                        content: "조회수가 보장된 고품질 영상 소스 5,000개 이상을 즉시 다운로드하여 평생 소장할 수 있습니다.",
                        icon: CheckCircle,
                        color: "text-emerald-600",
                        bgColor: "bg-emerald-100"
                      }
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-white text-slate-900 p-7 md:p-8 rounded-2xl shadow-xl border border-white/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col items-start text-left"
                      >
                        <div className={`w-14 h-14 rounded-2xl ${item.bgColor} ${item.color} flex items-center justify-center mb-5`}>
                          <item.icon className="w-8 h-8" />
                        </div>
                        <div className="text-blue-600 font-black text-xs mb-2 tracking-[0.18em] uppercase">{item.subtitle}</div>
                        <h4 className="text-xl md:text-2xl font-bold mb-3">{item.title}</h4>
                        <p className="text-slate-600 text-[15px] md:text-base leading-relaxed font-medium whitespace-pre-line">{item.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 text-white rounded-3xl p-8 md:p-12 text-center space-y-8 shadow-xl shadow-blue-200">
                <div className="space-y-2">
                  <h3 className="text-[30px] md:text-[36px] font-bold leading-tight">
                    ⏳
                    <br />
                    지금 바로 시작하기
                  </h3>
                </div>

                <div className="bg-white/15 border border-white/35 rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col items-center text-center gap-8 backdrop-blur-sm max-w-xl md:max-w-lg mx-auto w-full shadow-2xl">
                  <div className="w-full">
                    <p className="text-white/85 text-sm font-bold mb-2 tracking-widest uppercase">상품명</p>
                    <p className="text-2xl md:text-3xl font-black">
                      조회수 보장!<br />
                      쇼츠/릴스/틱톡 영상 <br className="block md:hidden" />
                      패키지
                    </p>
                  </div>
                  
                  <div className="w-full border-t border-white/30 pt-8">
                    <div className="w-full max-w-md md:max-w-xs mx-auto rounded-2xl px-4 py-5 flex flex-col items-center gap-4">
                      <div className="w-full space-y-2">
                        <div className="flex items-center justify-between text-sm md:text-base text-white/90">
                          <span>정가</span>
                          <span className="line-through decoration-white/70">79,000원</span>
                        </div>
                        <div className="flex items-center justify-between text-sm md:text-base text-white">
                          <span>일반 할인가</span>
                          <span className="font-semibold">30,000원</span>
                        </div>
                      </div>
                      <p className="text-white text-sm font-black tracking-[0.16em] uppercase">최종 혜택가</p>
                      <p className="text-4xl sm:text-5xl md:text-6xl font-black text-yellow-300 whitespace-nowrap tracking-tight">30,000<span className="text-xl sm:text-2xl md:text-3xl">원</span></p>
                      <Badge className="bg-red-500 text-white border-none font-bold text-sm py-1 px-3">62% OFF 적용됨</Badge>
                    </div>
                  </div>

                  <div className="w-full pt-4">
                    <Button 
                      size="lg"
                      className="w-full bg-white text-blue-600 hover:bg-slate-100 font-black h-auto py-5 px-8 text-xl sm:text-2xl rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-1 leading-tight whitespace-nowrap"
                      onClick={() => setIsPaymentModalOpen(true)}
                    >
                      <span className="text-sm opacity-70 font-bold">지금 바로</span>
                      <span className="whitespace-nowrap">결제하고 다운로드</span>
                    </Button>
                  </div>

                  <p className="max-w-2xl mx-auto whitespace-pre-line text-center text-[11px] md:text-xs leading-relaxed text-white/80 pt-2">
                    그대로 사용하실 경우 플랫폼측의 제제가 있을 수 있습니다.{"\n"}
                    (원 저작자가 문제를 제기하지는 않지만 시스템상 필터링 될 수 있습니다).{"\n"}
                    그래서 어느정도 수정,편집 후 사용을 권장드립니다.
                  </p>
                </div>
              </div>
            </section>
            </div>
            </div>

            {/* Right Sidebar (Floating Payment Box) */}
        <div className="hidden lg:block lg:w-1/3 sticky top-24 self-start">
          <div className="bg-white border-2 border-blue-600 rounded-2xl p-6 shadow-xl shadow-blue-900/10">
            <Badge className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-50 w-full justify-center mb-4 text-sm py-3 font-bold animate-pulse">
              ⏳ 런칭 기념 한정 특가
            </Badge>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              조회수 보장!<br />
              쇼츠/릴스/틱톡 영상 패키지
            </h3>
            <p className="text-sm text-slate-500 mb-4 pb-4 border-b border-slate-100">
              초보자도 가능한 자동화 수익 파이프라인
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm text-slate-600">
                <span>정가</span>
                <span className="line-through">79,000원</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>일반 할인가</span>
                <span>30,000원</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-slate-900">최종 혜택가</span>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-blue-600">{price.toLocaleString()}<span className="text-xl">원</span></div>
                </div>
              </div>
            </div>

            <ul className="space-y-3 mb-8 text-sm text-slate-700 bg-slate-50 p-4 rounded-xl">
              <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> 5,000개 이상의 원본 영상 소스</li>
              <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> 평생 소장 및 무제한 사용 권한</li>
              <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> 수정, 상업적 이용 (PLR)</li>
              <li className="flex gap-2 items-start font-bold text-slate-900"><Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> 패키지 100% 마진 재판매 권한 (MRR)</li>
              <li className="flex gap-2 items-start font-bold text-red-600"><Check className="w-4 h-4 text-red-600 shrink-0 mt-0.5" /> 배송 주기 : 구매 후 즉시 다운로드 가능</li>
            </ul>

            <Button 
              size="lg" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 text-lg shadow-md"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              즉시 구매하기
            </Button>
            <p className="text-xs text-center text-slate-400 mt-3">결제 완료 즉시 파일을 다운로드 할 수 있습니다.</p>
          </div>
        </div>

      </div>

      {/* Mobile Bottom CTA (Sticky) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 px-6 z-50 flex items-center justify-between shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] pb-safe">
        <div>
          <span className="text-xs font-bold text-red-500 block mb-0.5">최종 할인가</span>
          <div className="text-2xl font-extrabold text-slate-900 leading-none">
            {price.toLocaleString()}<span className="text-sm font-bold text-slate-600 ml-0.5">원</span>
          </div>
          <div className="mt-1 text-[11px] font-bold text-red-600 leading-tight">
            배송 주기 : 구매 후 즉시 다운로드 가능
          </div>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 h-12 rounded-xl"
          onClick={() => setIsPaymentModalOpen(true)}
        >
          결제하기
        </Button>
      </div>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 mt-12 pb-32 lg:pb-12 pt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-sm text-slate-500">
            <div>
              <h4 className="font-bold text-slate-700 mb-4 text-base">BARODE</h4>
              <p className="mb-1">상호명 : 바로드</p>
              <p className="mb-1">대표자 : 김선우</p>
              <p className="mb-1">사업자등록번호 : 859-20-02000</p>
              <p className="mb-1">주소 : 경기도 성남시 중원구 은행로38번길 17-12 401호</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-700 mb-4 text-base">고객안내</h4>
              <p className="mb-1">이메일 : seonwookim95@naver.com</p>
              <p className="mb-1">전화 : 010-6580-9502</p>
              <p className="mb-4">주말 및 공휴일 휴무</p>
              <div className="flex gap-4 text-xs font-medium text-slate-600">
                <a href="#" className="hover:text-blue-600 transition-colors">이용약관</a>
                <a href="#" className="hover:text-blue-600 transition-colors font-bold">개인정보처리방침</a>
                <a href="#" className="hover:text-blue-600 transition-colors">환불규정</a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-xs text-slate-400">
            <p>© {new Date().getFullYear()} BARODE. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 토스페이먼츠 결제 모달 (Dialog) */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">안전한 결제</DialogTitle>
            <DialogDescription className="text-base text-slate-500">
              토스페이먼츠를 통해 안전하게 결제가 진행됩니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-1 md:p-4 space-y-4">
            <div className="bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-100 text-sm font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
              PLR 구매자 전용 초특가 할인이 자동 적용되었습니다.
            </div>

            <div id="payment-method" className="w-full"></div>
            <div id="agreement" className="w-full"></div>

            <Button 
              size="lg" 
              className="w-full bg-[#3182f6] hover:bg-[#2b72d6] text-white text-xl font-bold h-16 rounded-xl mt-4"
              onClick={handlePaymentRequest}
            >
              {price.toLocaleString()}원 결제하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
