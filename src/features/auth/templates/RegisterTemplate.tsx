import { AuthCard } from "../components/AuthCard";
import { RegisterForm } from "../components/RegisterForm";

export const RegisterTemplate = () => {
    return (
        <AuthCard
            title="إنشاء حساب جديد"
            subtitle="انضم إلى مجتمع الطلاب الأكبر"
        >
            <RegisterForm />
        </AuthCard>
    );
};
