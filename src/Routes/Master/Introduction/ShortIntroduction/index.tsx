import ShortImage from "@/Components/Images/ShortImage.svg?react";
import Container from "../Container";

export default function ShortIntroduction() {
    return <Container image={ShortImage} title="比短還要更短！">
        <p>與其他短連結服務相比，我們的長度僅有7+8個字元(也就是15個字)。大幅縮短了使用者的困擾，使用者僅僅只需要花費個幾秒鐘，即可連結至您的目標！</p>
        <p className="mt-3">舉例來說，我只需要在瀏覽器中輸入<span className="font-mono">nap.tw/abcdefgh</span>這15個字元，即可導向目標網站！</p>
    </Container>
}