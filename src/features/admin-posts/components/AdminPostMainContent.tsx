import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, AlertCircle } from "lucide-react";
import { cn, formatImageUrl } from "@/lib/utils";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import AdminPostStatusBadge from "./AdminPostStatusBadge";
import { PostDetails } from "../types";

interface AdminPostMainContentProps {
    post: PostDetails;
    facilityNames?: string[];
}

const AdminPostMainContent: React.FC<AdminPostMainContentProps> = ({ post, facilityNames }) => {
    return (
        <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-xl overflow-hidden rounded-3xl bg-emerald-500/5">
                {post.images.length > 0 && (
                    <div className="w-full relative group">
                        <Carousel className="w-full" opts={{ direction: 'rtl' }}>
                            <CarouselContent>
                                {post.images.map((image, index) => (
                                    <CarouselItem key={index}>
                                        <div className="aspect-video w-full overflow-hidden">
                                            <img
                                                src={formatImageUrl(image)}
                                                alt={`${post.title} - ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            {post.images.length > 1 && (
                                <>
                                    <CarouselPrevious className="right-4 rotate-180 left-auto bg-white/20 hover:bg-white/40 border-none text-white backdrop-blur-md" />
                                    <CarouselNext className="left-4 rotate-180 right-auto bg-white/20 hover:bg-white/40 border-none text-white backdrop-blur-md" />
                                </>
                            )}
                        </Carousel>
                        <div className="absolute top-4 right-4 z-10">
                            <Badge className="bg-black/50 backdrop-blur-md border-none text-white px-3 py-1">
                                {post.images.length} صور
                            </Badge>
                        </div>
                    </div>
                )}
                <CardHeader className="p-8">
                    <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline" className="px-4 py-1 rounded-lg text-primary border-primary/20 bg-primary/5">
                            {post.type}
                        </Badge>
                        <AdminPostStatusBadge status={post.status} />
                    </div>
                    <CardTitle className="text-2xl md:text-4xl font-bold leading-tight">
                        {post.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-muted-foreground mt-4">
                        <div className="flex items-center gap-1.5 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>نُشر في {post.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{post.address}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    <div className="prose prose-slate max-w-none">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-primary" /> وصف المنشور
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {post.description}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-none shadow-lg rounded-2xl bg-primary/5">
                    <CardContent className="p-6">
                        <h4 className="font-bold mb-3">المرافق المتوفرة</h4>
                        <div className="flex flex-wrap gap-2">
                            {facilityNames && facilityNames.length > 0 ? (
                                facilityNames.map(f => (
                                    <Badge key={f} variant="secondary" className="rounded-md px-3 py-1 bg-emerald-500/10 text-emerald-600 border-none">{f}</Badge>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground italic">لا توجد مرافق معلنة</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg rounded-2xl bg-amber-500/5">
                    <CardContent className="p-6">
                        <h4 className="font-bold mb-3">شروط الإيجار</h4>
                        <p className="text-sm text-muted-foreground italic">يجب تقديم بطاقة جامعية سارية المفعول عند التعاقد.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminPostMainContent;
