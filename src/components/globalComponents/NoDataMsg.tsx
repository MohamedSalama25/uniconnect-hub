import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface NoDataMsgProps {
    title?: string;
    description?: string;
    additionalMessage?: string;
}

const NoDataMsg = ({
    title = "لا توجد بيانات",
    description = "لم يتم العثور على أي بيانات لعرضها في الوقت الحالي.",
    additionalMessage
}: NoDataMsgProps) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-xl border border-dashed border-border">
            <Alert className="max-w-md bg-background shadow-md">
                <Terminal className="h-4 w-4" />
                <AlertTitle className="font-bold text-lg mb-2">{title}</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                    {description}
                    {additionalMessage && <div className="mt-2 text-primary font-medium">{additionalMessage}</div>}
                </AlertDescription>
            </Alert>
        </div>
    );
};

export default NoDataMsg;
