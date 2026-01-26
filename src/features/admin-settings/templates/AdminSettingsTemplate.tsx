import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Briefcase, HelpCircle, Settings } from "lucide-react";
import { HouseTypesTable } from "../components/HouseTypesTable";
import { ServiceCategoriesTable } from "../components/ServiceCategoriesTable";
import { HelpRequestTypesTable } from "../components/HelpRequestTypesTable";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export const AdminSettingsTemplate = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in" dir="rtl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                        <Settings className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">إعدادات النظام</h1>
                        <p className="text-muted-foreground">إدارة أنواع السكن والخدمات وطلبات المساعدة</p>
                    </div>
                </div>

                <Tabs defaultValue="accommodation" className="space-y-6">
                    <TabsList className="bg-muted/50 p-1 rounded-xl h-auto flex-wrap justify-start gap-2">
                        <TabsTrigger value="accommodation" className="rounded-lg py-2.5 px-6 gap-2 data-[state=active]:bg-background shadow-sm">
                            <Building className="w-4 h-4" />
                            إعدادات السكن
                        </TabsTrigger>
                        <TabsTrigger value="services" className="rounded-lg py-2.5 px-6 gap-2 data-[state=active]:bg-background shadow-sm">
                            <Briefcase className="w-4 h-4" />
                            إعدادات الخدمات
                        </TabsTrigger>
                        <TabsTrigger value="help" className="rounded-lg py-2.5 px-6 gap-2 data-[state=active]:bg-background shadow-sm">
                            <HelpCircle className="w-4 h-4" />
                            طلبات المساعدة
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="accommodation" className="bg-card p-6 rounded-2xl border shadow-md animate-in fade-in-50 duration-500">
                        <HouseTypesTable />
                    </TabsContent>

                    <TabsContent value="services" className="bg-card p-6 rounded-2xl border shadow-md animate-in fade-in-50 duration-500">
                        <ServiceCategoriesTable />
                    </TabsContent>

                    <TabsContent value="help" className="bg-card p-6 rounded-2xl border shadow-md animate-in fade-in-50 duration-500">
                        <HelpRequestTypesTable />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};
