import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Calendar, MessageCircle, Shield, Building2, Utensils } from "lucide-react";
import { getUserPosts, Student } from "@/data/mockData";
import { useState, useEffect } from "react";

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
    userAvatar?: string;
    userId?: string;
}

export function UserProfileModal({ isOpen, onClose, userName, userAvatar, userId }: UserProfileModalProps) {
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen && userName) {
            setPosts(getUserPosts(userName));
        }
    }, [isOpen, userName]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-background" dir="rtl">
                {/* Header Background */}
                <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-background relative">
                    <div className="absolute -bottom-12 right-8">
                        <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                            <AvatarImage src={userAvatar} alt={userName} className="object-cover" />
                            <AvatarFallback className="text-2xl">{userName?.[0]}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div className="pt-14 px-8 pb-6">
                    {/* User Info */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-2xl font-bold">{userName}</h2>
                                <Badge variant="secondary" className="gap-1 bg-accent/10 text-accent hover:bg-accent/20">
                                    <Shield className="w-3 h-3" /> موثق
                                </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> القاهرة، مصر
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> انضم منذ 2024
                                </span>
                            </div>
                        </div>
                        <div className="text-center bg-muted/50 p-2 rounded-xl">
                            <div className="flex items-center gap-1 text-amber-500 font-bold text-lg justify-center">
                                4.8 <Star className="w-4 h-4 fill-current" />
                            </div>
                            <span className="text-xs text-muted-foreground">150 تقييم</span>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-6">
                        <Button className="flex-1 rounded-xl font-bold gap-2">
                            <MessageCircle className="w-4 h-4" /> مراسلة
                        </Button>
                        <Button variant="outline" className="flex-1 rounded-xl font-bold gap-2">
                            متابعة
                        </Button>
                    </div>

                    <Tabs defaultValue="posts" className="w-full">
                        <TabsList className="w-full grid grid-cols-3 mb-4">
                            <TabsTrigger value="posts">المنشورات ({posts.length})</TabsTrigger>
                            <TabsTrigger value="about">نبذة</TabsTrigger>
                            <TabsTrigger value="reviews">التقييمات</TabsTrigger>
                        </TabsList>

                        <ScrollArea className="h-[300px] pr-4 -mr-4">
                            <TabsContent value="posts" className="space-y-4 mt-0">
                                {posts.length > 0 ? (
                                    posts.map((post, index) => (
                                        <Card key={index} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex gap-4 p-3">
                                                <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                                                    <img
                                                        src={post.image || post.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"}
                                                        alt={post.title || post.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-bold truncate">{post.title || post.name}</h4>
                                                            <Badge variant="outline" className="text-xs shrink-0">
                                                                {post.type}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                            {post.description || post.address}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                                                        <span className="flex items-center gap-1">
                                                            {post.type === 'سكن' ? <Building2 className="w-3 h-3" /> : <Utensils className="w-3 h-3" />}
                                                            {post.location || post.address}
                                                        </span>
                                                        <div className="flex items-center gap-1 text-amber-500 font-medium">
                                                            <Star className="w-3 h-3 fill-current" />
                                                            {post.rating}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        لا توجد منشورات حالياً
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="about" className="mt-0 space-y-4">
                                <div className="space-y-2">
                                    <h3 className="font-bold text-sm">عن المستخدم</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        طالب في السنة النهائية في كلية الهندسة. مهتم بمساعدة الطلاب الجدد وتوفير سكن مريح وآمن.
                                        أقوم بتأجير وإدارة عدة وحدات سكنية بالقرب من الجامعة.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-sm">اللغات</h3>
                                    <div className="flex gap-2">
                                        <Badge variant="secondary">العربية</Badge>
                                        <Badge variant="secondary">English</Badge>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="reviews" className="mt-0 space-y-3">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="bg-muted/30 p-3 rounded-xl space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="w-6 h-6">
                                                    <AvatarFallback>S</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-bold">سمير علي</span>
                                            </div>
                                            <div className="flex text-amber-500">
                                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            شخص محترم جداً ومتعاون. الشقة كانت نظيفة ومطابقة للصور.
                                        </p>
                                    </div>
                                ))}
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
