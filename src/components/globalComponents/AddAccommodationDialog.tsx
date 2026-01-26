import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Upload, X, Loader2, Home, MapPin, Bath, BedDouble, Wifi, Wind, Waves, Coffee, ShieldCheck, GraduationCap, Edit, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LocationPicker } from "./LocationPicker";
import { cn, formatImageUrl, extractRelativeImageUrl } from "@/lib/utils";
import { useCreateHouse } from "@/features/accommodation-list/hooks/useCreateHouse";
import { useUpdateHouse } from "@/features/accommodation-list/hooks/useUpdateHouse";
import { House } from "@/features/accommodation-list/types/house.types";
import { useHouseDetail } from "@/features/admin-posts/hooks/useHouseDetail";
import { adminSettingsService } from "@/features/admin-settings/services/admin-settings.service";
import { houseService } from "@/features/accommodation-list/services/house.service";
import { useQuery } from "@tanstack/react-query";

const amenitiesOptions = [
    { id: "wifi", label: "واي فاي", icon: Wifi },
    { id: "ac", label: "مكيف", icon: Wind },
    { id: "laundry", label: "غسالة", icon: Waves },
    { id: "kitchen", label: "مطبخ مجهز", icon: Coffee },
    { id: "security", label: "أمن 24 ساعة", icon: ShieldCheck },
    { id: "study", label: "منطقة دراسة", icon: GraduationCap },
];

const formSchema = z.object({
    name: z.string().min(5, { message: "عنوان المنشور يجب أن يكون 5 أحرف على الأقل" }),
    description: z.string().min(20, { message: "الوصف يجب أن يكون 20 حرفاً على الأقل" }),
    price: z.string().min(1, { message: "يرجى تحديد السعر" }),
    rooms: z.string().min(1, { message: "يرجى تحديد عدد الغرف" }),
    bathrooms: z.string().min(1, { message: "يرجى تحديد عدد دورات المياه" }),
    typeId: z.string().min(1, { message: "يرجى اختيار نوع السكن" }),
    address: z.string().min(5, { message: "يرجى إدخال العنوان بالتفصيل" }).max(30, { message: "العنوان يجب ألا يتجاوز 30 حرفاً" }),
    amenities: z.array(z.string()).default([]),
    location: z.object({
        lat: z.number(),
        lng: z.number()
    }).optional(),
});

interface AddAccommodationDialogProps {
    trigger?: React.ReactNode;
    triggerClassName?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    initialData?: House; // For Edit Mode
}

export function AddAccommodationDialog({
    trigger,
    triggerClassName,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    initialData
}: AddAccommodationDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = controlledOpen !== undefined ? setControlledOpen : setInternalOpen;

    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]); // URLs of existing images for edit
    const [deletingImages, setDeletingImages] = useState<string[]>([]); // URLs of images currently being deleted
    const createHouseMutation = useCreateHouse();
    const updateHouseMutation = useUpdateHouse();
    const isEditMode = !!initialData;

    // Fetch house types dynamically
    const { data: houseTypesData } = useQuery({
        queryKey: ["house-types"],
        queryFn: () => adminSettingsService.getHouseTypes({ pageSize: 100 }),
    });
    const houseTypes = houseTypesData?.data || [];

    // Fetch full detail if editing, to ensure we have all data (images, etc) that might be missing in list view
    const { data: fetchedHouse } = useHouseDetail(initialData?.id?.toString());
    const activeData = fetchedHouse || initialData;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: "",
            rooms: "",
            bathrooms: "",
            typeId: "1",
            address: "",
            amenities: [],
        },
    });

    // Populate form if activeData changes (Edit Mode)
    useEffect(() => {
        if (activeData && open && isEditMode) {
            form.reset({
                name: activeData.name,
                description: activeData.description,
                price: activeData.price.toString(),
                rooms: activeData.numberOfRooms.toString(),
                bathrooms: activeData.numberOfBathrooms.toString(),
                typeId: activeData.typeId.toString(),
                address: activeData.address,
                amenities: activeData.facilityNames || [],
                location: {
                    lat: activeData.latitude || 0,
                    lng: activeData.longitude || 0
                },
            });
            setExistingImages(activeData.imageUrls || []);
            setImages([]);
            setImagePreviews([]);
        } else if (!isEditMode && open) {
            form.reset({
                name: "",
                description: "",
                price: "",
                rooms: "",
                bathrooms: "",
                typeId: "1",
                address: "",
                amenities: [],
            });
            setExistingImages([]);
            setImages([]);
            setImagePreviews([]);
        }
    }, [activeData, open, form, isEditMode]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // Validation: Must have at least one image (new or existing)
        if (images.length === 0 && existingImages.length === 0) {
            toast.error("يرجى إضافة صورة واحدة على الأقل");
            return;
        }

        const requestData = {
            Name: values.name,
            Address: values.address,
            Description: values.description,
            Price: parseFloat(values.price),
            NumberOfRooms: parseInt(values.rooms),
            NumberOfBathrooms: parseInt(values.bathrooms),
            TypeId: parseInt(values.typeId),
            IsAvailable: true,
            AvailableFrom: new Date().toISOString(),
            Facilities: values.amenities,
            Images: isEditMode ? images : [...existingImages, ...images], // For edit, only send NEW files as requested
            Latitude: values.location?.lat || 0,
            Longitude: values.location?.lng || 0,
        };

        if (isEditMode && initialData) {
            // Perform the update with ONLY new images (existing ones are now handled immediately)
            updateHouseMutation.mutate({ id: initialData.id, data: requestData }, {
                onSuccess: () => {
                    setOpen(false);
                }
            });
        } else {
            createHouseMutation.mutate(requestData, {
                onSuccess: (response) => {
                    const isError = response.statusCode && response.statusCode >= 400;
                    if (!isError) {
                        setOpen(false);
                        form.reset();
                        setImages([]);
                        setImagePreviews([]);
                    }
                }
            });
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setImages([...images, ...newFiles]);

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setImagePreviews([...imagePreviews, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const removeExistingImage = async (index: number) => {
        if (!initialData) return;

        const urlToRemove = existingImages[index];
        const relativeUrl = extractRelativeImageUrl(urlToRemove);

        setDeletingImages(prev => [...prev, urlToRemove]);
        const promise = houseService.deleteHouseImage(initialData.id, relativeUrl);

        toast.promise(promise, {
            loading: 'جاري حذف الصورة من السيرفر...',
            success: () => {
                setExistingImages(prev => prev.filter((_, i) => i !== index));
                setDeletingImages(prev => prev.filter(url => url !== urlToRemove));
                return 'تم حذف الصورة بنجاح';
            },
            error: (err) => {
                setDeletingImages(prev => prev.filter(url => url !== urlToRemove));
                return 'فشل حذف الصورة، يرجى المحاولة مرة أخرى';
            }
        });
    };

    // Note: We cannot "remove" existing images easily with current API unless there's a specific endpoint or logic for it.
    // For now, we will just display them. If user wants to replace, they might need to delete post and create new one or we assume backend handles "Images" as "Add Images" and doesn't delete old ones unless specified.
    // However, usually "Update" might replace all or be partial. Assuming backend just adds new images or replaces. 
    // Given the task, we'll keep it simple: We just show existing. Removing existing is complex without backend support.

    const isDeleting = deletingImages.length > 0;
    const isLoading = createHouseMutation.isPending || updateHouseMutation.isPending || isDeleting;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger !== null && (
                <DialogTrigger asChild>
                    {trigger || (
                        <Button className={cn("gap-2 font-bold shadow-lg shadow-primary/20", triggerClassName)}>
                            <Plus className="w-5 h-5" />
                            <span>إضافة سكن</span>
                        </Button>
                    )}
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {isEditMode ? "تعديل بيانات السكن" : "إضافة سكن جديد"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode ? "قم بتحديث تفاصيل السكن." : "أدخل تفاصيل السكن المتاح لضمان الحصول على أفضل المستأجرين."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>عنوان الإعلان <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="مثال: شقة للإيجار حي النرجس..." className="h-12 text-base bg-background" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="typeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>نوع السكن <span className="text-red-500">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger dir="rtl" className="h-12 text-base">
                                                    <SelectValue placeholder="اختر نوع السكن" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent dir="rtl">
                                                {houseTypes.map((type) => (
                                                    <SelectItem key={type.id} value={type.id.toString()}>
                                                        {type.typeName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="bg-background p-6 rounded-2xl border border-border grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 flex items-center gap-2 text-blue-700 font-bold border-b border-border pb-2 mb-2">
                                <Home className="w-5 h-5" />
                                تفاصيل السكن
                            </div>

                            <FormField
                                control={form.control}
                                name="rooms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>عدد الغرف</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <BedDouble className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input type="number" placeholder="مثال: 3" className="h-12 bg-background pr-10" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bathrooms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>عدد دورات المياه</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Bath className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input type="number" placeholder="مثال: 2" className="h-12 bg-background pr-10" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>العنوان بالتفصيل</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input placeholder="الحي، اسم الشارع، رقم المبنى" className="h-12 bg-background pr-10" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Amenities Selection */}
                        <div className="space-y-4">
                            <FormLabel className="text-lg font-bold">المرافق المتاحة</FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {amenitiesOptions.map((option) => (
                                    <FormField
                                        key={option.id}
                                        control={form.control}
                                        name="amenities"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={option.id}
                                                    className="flex flex-row items-center space-x-3 space-y-0 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(option.label)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, option.label])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value) => value !== option.label
                                                                        )
                                                                    );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="flex items-center gap-2 font-medium cursor-pointer pr-2">
                                                        <option.icon className="w-4 h-4 text-primary" />
                                                        {option.label}
                                                    </FormLabel>
                                                </FormItem>
                                            );
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Location Picker (Visual Only) */}
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>تحديد الموقع على الخريطة</FormLabel>
                                    <FormControl>
                                        <LocationPicker
                                            onLocationSelect={(loc) => field.onChange(loc)}
                                            defaultLocation={field.value as { lat: number; lng: number } | undefined}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>وصف السكن <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="اوصف السكن والمميزات الإضافية..."
                                            className="min-h-[120px] resize-none text-base bg-background"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Images */}
                        <div>
                            <FormLabel className="block mb-3 text-lg font-bold">صور السكن <span className="text-red-500">*</span></FormLabel>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {/* Existing Images */}
                                {isEditMode && existingImages.map((img, idx) => (
                                    <div key={`existing-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border bg-muted group shadow-sm">
                                        <img src={formatImageUrl(img)} alt="existing" className={cn("w-full h-full object-cover", deletingImages.includes(img) && "opacity-40 grayscale")} />
                                        {deletingImages.includes(img) ? (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(idx)}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/40 py-1 text-[10px] text-white text-center">
                                            {deletingImages.includes(img) ? "جاري الحذف..." : "صورة حالية"}
                                        </div>
                                    </div>
                                ))}

                                {/* New Image Previews */}
                                {imagePreviews.map((img, idx) => (
                                    <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border bg-muted group shadow-sm">
                                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-primary/60 py-1 text-[10px] text-white text-center">صورة جديدة</div>
                                    </div>
                                ))}

                                {/* Upload Button */}
                                <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all">
                                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                                    <span className="text-xs text-muted-foreground font-medium">رفع صور إضافية</span>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="grid grid-cols-1 gap-6 bg-muted/20 p-6 rounded-xl">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>السعر شهرياً <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="مثال: 3500 جنيه" className="h-12 bg-background" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-12 px-6">
                                إلغاء
                            </Button>
                            <Button type="submit" className="h-12 px-8 font-bold gap-2" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {isEditMode ? "جاري التحديث..." : "جاري الإضافة..."}
                                    </>
                                ) : (
                                    <>
                                        {isEditMode ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                        {isEditMode ? "حفظ التعديلات" : "إضافة السكن"}
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
