import Faq from "@/Components/boiler/Faq";
import { HeroSection } from "@/Components/boiler/hero-section";
import { HomeTypesStrip } from "@/Components/boiler/home-types-strip";
import { InstagramFeed } from "@/Components/boiler/InstagramFeed";
import { ServiceCards } from "@/Components/boiler/service-cards";
import WhyChooseUs from "@/Components/boiler/WhyChooseUs";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";
import { useEffect } from "react";

export default function Home() {
    useEffect(() => {
        const existingScript = document.getElementById("EmbedSocialHashtagScript");

        if (existingScript) {
            existingScript.remove();
        }

        const widgets = document.querySelectorAll(".embedsocial-hashtag");
        widgets.forEach((widget) => {
            widget.innerHTML = "";
        });

        const script = document.createElement("script");
        script.id = "EmbedSocialHashtagScript";
        script.src = `https://embedsocial.com/cdn/ht.js?v=${Date.now()}`;
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <>
            <Head title="Home" />
            <main className="min-h-screen">
                {/* <Header/> */}
                <GuestLayout>
                    <HeroSection />
                    <InstagramFeed />
                    <HomeTypesStrip />
                    <ServiceCards />
                    <WhyChooseUs />
                    <Faq />
                </GuestLayout>
                {/* <Footer /> */}
            </main>
        </>
    );
}
