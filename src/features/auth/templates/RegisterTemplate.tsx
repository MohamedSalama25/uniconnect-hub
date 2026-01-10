import { useState } from "react";
import { AuthCard } from "../components/AuthCard";
import { RegisterForm } from "../components/RegisterForm";
import { RoleSelection } from "../components/RoleSelection";

export const RegisterTemplate = () => {
    const [selectedRole, setSelectedRole] = useState<"student" | "provider" | null>(null);

    return (
        <AuthCard
            title={!selectedRole ? "اختر نوع الحساب" : "إنشاء حساب جديد"}
            subtitle={!selectedRole ? "انضم إلينا كطالب أو كمقدم خدمة" : "يرجى إكمال البيانات التالية"}
            className="max-w-4xl"
        >
            {!selectedRole ? (
                <RoleSelection onSelect={setSelectedRole} />
            ) : (
                <RegisterForm
                    selectedRole={selectedRole}
                    onBack={() => setSelectedRole(null)}
                />
            )}
        </AuthCard>
    );
};
