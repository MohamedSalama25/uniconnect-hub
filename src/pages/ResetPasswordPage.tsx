import { AuthCard } from "@/features/auth/components/AuthCard";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

const ResetPasswordPage = () => {
    return (
        <AuthCard
            title="تعيين كلمة المرور"
            subtitle="يرجى إدخال كلمة المرور الجديدة الخاصة بك"
        >
            <ResetPasswordForm />
        </AuthCard>
    );
};

export default ResetPasswordPage;
