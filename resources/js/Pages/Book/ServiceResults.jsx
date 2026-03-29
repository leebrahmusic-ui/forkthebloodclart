import QuoteResultsPage from "@/Components/extra/QuoteResultsPage";
import { PageHeader } from "@/Components/ui/page-header";
import { usePage, Head } from "@inertiajs/react";

export default function ServiceResults() {
    const { answers, title } = usePage().props;
    console.log("ServiceResults answers:", answers);
    return (
        <>
            <Head title={title} />
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#eaf3fb] via-[#edf4fb] to-[#e4ecf6]">
                <div className="absolute inset-x-0 top-4 z-30">
                    <PageHeader theme="blue" />
                </div>

                <div className="pt-24">
                    <QuoteResultsPage answers={answers} />
                </div>
            </div>
        </>
    );
}
