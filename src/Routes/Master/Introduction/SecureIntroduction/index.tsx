import SecureImage from "@/Components/Images/SecureImage.svg?react";
import Container from "../Container";

export default function SecoreIntroduction() {
    return <Container image={SecureImage} title="可加密你的短連結！">
        <p>害怕你的短連結被不明人士盜取嗎？不用擔心！我們提供你最佳的加密短連結，你完全不用擔心我們或其他人會知道你的原始目的地，因為你的網址已被加密起來了！</p>
        <p className="mt-3">原始網址加密皆在您的裝置上執行，無須擔心我們會知道你的目的地。</p>
    </Container>
}