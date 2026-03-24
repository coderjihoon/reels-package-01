import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. 프론트엔드에서 보낸 결제 승인 요청 데이터 파싱
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    // 2. 시크릿 키로 토스 API 인증 헤더 생성 (Basic Auth)
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      throw new Error("서버에 시크릿 키가 설정되지 않았습니다.");
    }
    const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString("base64");

    // 3. 토스페이먼츠 승인 API 호출
    const response = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${encryptedSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      }
    );

    const data = await response.json();

    // 4. 승인 성공 시 응답 반환
    if (response.ok) {
      // TODO: 실제 환경에서는 여기서 데이터베이스에 결제 내역을 저장합니다.
      
      // [가상 구현] 이메일 자동 발송 시뮬레이션
      const customerEmail = "customer123@gmail.com"; // 실제로는 requestPayment 시 넘긴 이메일을 토스 웹훅이나 DB에서 조회하여 사용
      console.log(`[Email Service] ${customerEmail} 로 5,000+ 영상 PLR 패키지 다운로드 링크 발송 완료!`);

      // [가상 구현] 임시 다운로드 링크 생성 (public 폴더 내의 파일 경로)
      const mockDownloadLink = "/dummy-plr-package.zip";

      return NextResponse.json({ 
        success: true, 
        data,
        downloadLink: mockDownloadLink,
        message: "결제가 완료되었으며 이메일로 다운로드 링크가 발송되었습니다."
      }, { status: 200 });
    } else {
      // 승인 실패 시 에러 응답
      return NextResponse.json({ success: false, message: data.message, code: data.code }, { status: response.status });
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error("결제 승인 중 오류 발생:", err);
    return NextResponse.json({ success: false, message: "서버 내부 오류가 발생했습니다." }, { status: 500 });
  }
}
