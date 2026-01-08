import { AuthCard } from "../components/AuthCard";
import { LoginForm } from "../components/LoginForm";

export const LoginTemplate = () => {
    return (
        <AuthCard
            title="تسجيل الدخول"
            subtitle="أهلاً بك مجدداً في يوني كونكت"
        >
            <LoginForm />
        </AuthCard>
    );
};
