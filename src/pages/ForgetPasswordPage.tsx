import { AuthCard } from "@/features/auth/components/AuthCard";
import { ForgetPasswordForm } from "@/features/auth/components/ForgetPasswordForm";

const ForgetPasswordPage = () => {
    return (
        <AuthCard
            title="نسيت كلمة المرور"
            subtitle="أدخل بريدك الإلكتروني لإرسال رابط التعيين"
        >
            <ForgetPasswordForm />
        </AuthCard>
    );
};

export default ForgetPasswordPage;
