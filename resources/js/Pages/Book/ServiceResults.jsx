import QuoteResultsPage from "@/Components/extra/QuoteResultsPage";
import { PageHeader } from "@/Components/ui/page-header";
import BlueQuoteSkin from "@/Components/extra/BlueQuoteSkin";
import { usePage, Head } from "@inertiajs/react";

export default function ServiceResults() {
    const { answers, title } = usePage().props;
    console.log("ServiceResults answers:", answers);
    return (
        <>
            <Head title={title} />
            <BlueQuoteSkin>
                <PageHeader />
                <QuoteResultsPage answers={answers} />
            </BlueQuoteSkin>
        </>
    );
}
