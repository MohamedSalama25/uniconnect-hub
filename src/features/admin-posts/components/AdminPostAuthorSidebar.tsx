import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, UserCheck } from "lucide-react";
import { UserProfileTrigger } from "@/components/globalComponents/UserProfileTrigger";
import { PostDetails } from "../types";

interface AdminPostAuthorSidebarProps {
    post: PostDetails;
}

const AdminPostAuthorSidebar: React.FC<AdminPostAuthorSidebarProps> = ({ post }) => {
    return (
        <div className="space-y-6">
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden sticky top-8">
                <div className="h-24 bg-gradient-to-r from-primary to-primary-foreground/20" />
                <CardContent className="p-8 -mt-12">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="relative">
                            <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} />
                                <AvatarFallback>{post.author[0]}</AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 bg-green-500 border-2 border-background w-6 h-6 rounded-full flex items-center justify-center">
                                <UserCheck className="w-3 h-3 text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{post.author}</h3>
                            <p className="text-sm text-muted-foreground">{post.university}</p>
                        </div>
                        <div className="w-full pt-4 space-y-3">
                            <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-xl transition-colors hover:bg-muted">
                                <Phone className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium" dir="ltr">{post.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-xl transition-colors hover:bg-muted">
                                <Mail className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">{post.email}</span>
                            </div>
                            <UserProfileTrigger
                                userId={post.authorId}
                                name={post.author}
                                avatar={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`}
                                className="w-full"
                            >
                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl gap-2 font-bold border-primary/20 hover:bg-primary/5"
                                >
                                    <User className="w-4 h-4" /> فحص الملف الشخصي
                                </Button>
                            </UserProfileTrigger>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/30 p-6 flex flex-col gap-4 border-t">
                    <div className="flex justify-between w-full text-sm">
                        <span className="text-muted-foreground">تاريخ الانضمام</span>
                        <span className="font-bold">سبتمبر 2024</span>
                    </div>
                    <div className="flex justify-between w-full text-sm">
                        <span className="text-muted-foreground">إجمالي المنشورات</span>
                        <span className="font-bold text-primary">12 منشور</span>
                    </div>
                    <div className="flex justify-between w-full text-sm">
                        <span className="text-muted-foreground">الحساب موثق</span>
                        <Badge className="bg-green-100 text-green-700 border-none">نعم</Badge>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AdminPostAuthorSidebar;
