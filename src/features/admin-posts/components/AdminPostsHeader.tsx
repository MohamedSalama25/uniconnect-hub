import React from "react";

const AdminPostsHeader: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">إدارة المنشورات</h1>
                <p className="text-muted-foreground mt-1">مراجعة والتحكم في المنشورات قبل ظهورها للمستخدمين</p>
            </div>
            <div>
                {/* Reserved for future actions like export or add */}
            </div>
        </div>
    );
};

export default AdminPostsHeader;
