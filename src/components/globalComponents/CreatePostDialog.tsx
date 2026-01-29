
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Plus, Upload, X, Loader2, Home, Truck, Briefcase, MapPin, Bath, BedDouble, Users } from "lucide-react";
// import { toast } from "sonner";

// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
//     DialogFooter,
// } from "@/components/ui/dialog";
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
//     FormDescription
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { LocationPicker } from "./LocationPicker";
// import { cn } from "@/lib/utils";

// // Enhanced Form Schema
// const formSchema = z.object({
//     title: z.string().min(5, { message: "عنوان المنشور يجب أن يكون 5 أحرف على الأقل" }),
//     type: z.string({ required_error: "يرجى اختيار نوع المنشور" }),
//     description: z.string().min(20, { message: "الوصف يجب أن يكون 20 حرفاً على الأقل" }),
//     university: z.string().optional(),

//     // Dynamic fields
//     price: z.string().optional(),
//     phone: z.string().min(10, { message: "رقم الهاتف غير صحيح" }),

//     // Accommodation specific
//     rooms: z.string().optional(),
//     bathrooms: z.string().optional(),
//     accommodationType: z.enum(["individual", "shared"]).optional(),
//     address: z.string().optional(),

//     // Transportation specific
//     passengerCapacity: z.string().optional(),

//     // Location
//     location: z.object({
//         lat: z.number(),
//         lng: z.number()
//     }).optional(),
// }).refine((data) => {
//     if (data.type === 'accommodation') {
//         return !!data.rooms && !!data.bathrooms && !!data.accommodationType && !!data.address;
//     }
//     if (data.type === 'transportation') {
//         return !!data.passengerCapacity;
//     }
//     return true;
// }, {
//     message: "يرجى تعبئة جميع الحقول المطلوبة لهذا النوع",
//     path: ["type"] // Attach error to type field broadly
// });

// interface CreatePostDialogProps {
//     trigger?: React.ReactNode;
//     btnColor?: "primary" | "secondary" | "destructive" | "outline" | "ghost";
//     triggerClassName?: string;
//     open?: boolean;
//     onOpenChange?: (open: boolean) => void;
// }

// export function CreatePostDialog({ trigger, btnColor, triggerClassName, open: controlledOpen, onOpenChange: setControlledOpen }: CreatePostDialogProps) {
//     const [internalOpen, setInternalOpen] = useState(false);

//     const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
//     const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

//     const [images, setImages] = useState<string[]>([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             title: "",
//             description: "",
//             university: "",
//             price: "",
//             phone: "",
//             rooms: "",
//             bathrooms: "",
//             address: "",
//             passengerCapacity: "",
//         },
//     });

//     const postType = form.watch("type");

//     const onSubmit = async (values: z.infer<typeof formSchema>) => {
//         if (images.length === 0) {
//             toast.error("يرجى إضافة صورة واحدة على الأقل");
//             return;
//         }

//         setIsSubmitting(true);
//         // Simulate API call
//         await new Promise((resolve) => setTimeout(resolve, 2000));

//         console.log({ ...values, images });
//         toast.success("تم إنشاء المنشور بنجاح!", {
//             description: "سيتم مراجعة منشورك من قبل المشرفين قبل النشر."
//         });

//         setIsSubmitting(false);
//         setOpen(false);
//         form.reset();
//         setImages([]);
//     };

//     const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = e.target.files;
//         if (files) {
//             const newImages = Array.from(files).map(file => URL.createObjectURL(file));
//             setImages([...images, ...newImages]);
//         }
//     };

//     const removeImage = (index: number) => {
//         setImages(images.filter((_, i) => i !== index));
//     };

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 {trigger || (
//                     <Button className={cn("w-full gap-2 font-bold shadow-lg shadow-secondary/20", triggerClassName)}>
//                         <Plus className="w-5 h-5" />
//                         <span>إضافة منشور</span>
//                     </Button>
//                 )}
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
//                 <DialogHeader>
//                     <DialogTitle className="text-2xl font-bold">إضافة منشور جديد</DialogTitle>
//                     <DialogDescription>
//                         شارك خدماتك أو طلباتك مع مجتمع الجامعة. يرجى تعبئة جميع الحقول المطلوبة.
//                     </DialogDescription>
//                 </DialogHeader>

//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">

//                         {/* Top Section: Type & Title */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <FormField
//                                 control={form.control}
//                                 name="type"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>نوع المنشور <span className="text-red-500">*</span></FormLabel>
//                                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                             <FormControl>
//                                                 <SelectTrigger className="h-12 text-base">
//                                                     <SelectValue placeholder="اختر نوع المنشور" />
//                                                 </SelectTrigger>
//                                             </FormControl>
//                                             <SelectContent>
//                                                 <SelectItem value="accommodation" className="cursor-pointer">
//                                                     <div className="flex items-center gap-2">
//                                                         <Home className="w-4 h-4 text-blue-500" />
//                                                         <span>سكن</span>
//                                                     </div>
//                                                 </SelectItem>
//                                                 <SelectItem value="transportation" className="cursor-pointer">
//                                                     <div className="flex items-center gap-2">
//                                                         <Truck className="w-4 h-4 text-orange-500" />
//                                                         <span>مواصلات</span>
//                                                     </div>
//                                                 </SelectItem>
//                                                 <SelectItem value="service" className="cursor-pointer">
//                                                     <div className="flex items-center gap-2">
//                                                         <Briefcase className="w-4 h-4 text-purple-500" />
//                                                         <span>خدمة / أخرى</span>
//                                                     </div>
//                                                 </SelectItem>
//                                             </SelectContent>
//                                         </Select>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <FormField
//                                 control={form.control}
//                                 name="title"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>عنوان المنشور <span className="text-red-500">*</span></FormLabel>
//                                         <FormControl>
//                                             <Input placeholder="مثال: شقة للإيجار حي النرجس..." className="h-12 text-base" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>

//                         {/* Dynamic Fields Section */}
//                         {postType === 'accommodation' && (
//                             <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
//                                 <div className="md:col-span-2 flex items-center gap-2 text-blue-700 font-bold border-b border-blue-200 pb-2 mb-2">
//                                     <Home className="w-5 h-5" />
//                                     تفاصيل السكن
//                                 </div>

//                                 <FormField
//                                     control={form.control}
//                                     name="accommodationType"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>نوع السكن</FormLabel>
//                                             <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                                 <FormControl>
//                                                     <SelectTrigger className="h-12 bg-white">
//                                                         <SelectValue placeholder="اختر نوع السكن" />
//                                                     </SelectTrigger>
//                                                 </FormControl>
//                                                 <SelectContent>
//                                                     <SelectItem value="individual">غرفة فردية</SelectItem>
//                                                     <SelectItem value="shared">سكن مشترك</SelectItem>
//                                                 </SelectContent>
//                                             </Select>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                                 <FormField
//                                     control={form.control}
//                                     name="address"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>العنوان بالتفصيل</FormLabel>
//                                             <FormControl>
//                                                 <Input placeholder="الحي، اسم الشارع، رقم المبنى" className="h-12 bg-white" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                                 <FormField
//                                     control={form.control}
//                                     name="rooms"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>عدد الغرف</FormLabel>
//                                             <FormControl>
//                                                 <Input type="number" placeholder="مثال: 3" className="h-12 bg-white" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                                 <FormField
//                                     control={form.control}
//                                     name="bathrooms"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>عدد دورات المياه</FormLabel>
//                                             <FormControl>
//                                                 <Input type="number" placeholder="مثال: 2" className="h-12 bg-white" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             </div>
//                         )}

//                         {postType === 'transportation' && (
//                             <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
//                                 <div className="md:col-span-2 flex items-center gap-2 text-orange-700 font-bold border-b border-orange-200 pb-2 mb-2">
//                                     <Truck className="w-5 h-5" />
//                                     تفاصيل المواصلات
//                                 </div>
//                                 <FormField
//                                     control={form.control}
//                                     name="passengerCapacity"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>عدد الركاب المتاح</FormLabel>
//                                             <FormControl>
//                                                 <Input type="number" placeholder="مثال: 4" className="h-12 bg-white" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                                 <FormField
//                                     control={form.control}
//                                     name="price"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>سعر التوصيل (شهري/يومي)</FormLabel>
//                                             <FormControl>
//                                                 <Input placeholder="مثال: 500 ريال شهرياً" className="h-12 bg-white" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             </div>
//                         )}

//                         {/* Location Picker */}
//                         <FormField
//                             control={form.control}
//                             name="location"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>الموقع الجغرافي (اختياري)</FormLabel>
//                                     <FormControl>
//                                         <LocationPicker
//                                             onLocationSelect={(loc) => field.onChange(loc)}
//                                             defaultLocation={field.value as { lat: number; lng: number } | undefined}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         {/* Common Description */}
//                         <FormField
//                             control={form.control}
//                             name="description"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>تفاصيل المنشور <span className="text-red-500">*</span></FormLabel>
//                                     <FormControl>
//                                         <Textarea
//                                             placeholder="اوصف العرض أو الطلب بدقة..."
//                                             className="min-h-[120px] resize-none text-base bg-muted/20"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormDescription>
//                                         حاول كتابة كل التفاصيل المهمة لزيادة فرصة القبول.
//                                     </FormDescription>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         {/* Images */}
//                         <div>
//                             <FormLabel className="block mb-3">صور المنشور (اختر صور متعددة)</FormLabel>
//                             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                                 {images.map((img, idx) => (
//                                     <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border bg-muted group shadow-sm">
//                                         <img src={img} alt="preview" className="w-full h-full object-cover" />
//                                         <button
//                                             type="button"
//                                             onClick={() => removeImage(idx)}
//                                             className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                                         >
//                                             <X className="w-3 h-3" />
//                                         </button>
//                                     </div>
//                                 ))}
//                                 <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all">
//                                     <Upload className="w-6 h-6 text-muted-foreground mb-2" />
//                                     <span className="text-xs text-muted-foreground">رفع صور</span>
//                                     <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
//                                 </label>
//                             </div>
//                         </div>

//                         {/* Price & Phone */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-6 rounded-xl">
//                             <FormField
//                                 control={form.control}
//                                 name="phone"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>رقم التواصل <span className="text-red-500">*</span></FormLabel>
//                                         <FormControl>
//                                             <Input placeholder="05xxxxxxxx" className="h-12 dir-ltr bg-white" style={{ direction: 'ltr', textAlign: 'right' }} {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                             {postType !== 'transportation' && (
//                                 <FormField
//                                     control={form.control}
//                                     name="price"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>السعر (اختياري)</FormLabel>
//                                             <FormControl>
//                                                 <Input placeholder="مثال: 1500 ريال" className="h-12 bg-white" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             )}
//                         </div>

//                         <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
//                             <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-12 px-6">
//                                 إلغاء
//                             </Button>
//                             <Button type="submit" className="h-12 px-8 font-bold gap-2" disabled={isSubmitting}>
//                                 {isSubmitting ? (
//                                     <>
//                                         <Loader2 className="w-4 h-4 animate-spin" />
//                                         جاري النشر...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Plus className="w-5 h-5" />
//                                         نشر الإعلان
//                                     </>
//                                 )}
//                             </Button>
//                         </DialogFooter>
//                     </form>
//                 </Form>
//             </DialogContent>
//         </Dialog>
//     );
// }
