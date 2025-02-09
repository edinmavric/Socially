import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ProfilePageSkeleton() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Card>
                <CardContent className="flex flex-col items-center text-center p-6">
                    <Skeleton className="w-24 h-24 rounded-full" />
                    <Skeleton className="mt-4 h-6 w-40" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="mt-2 h-10 w-3/4" />

                    <div className="w-full mt-6 flex justify-between">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                    </div>

                    <Skeleton className="w-full mt-4 h-10" />

                    <div className="w-full mt-6 space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/3" />
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="posts" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger value="" className="px-6 font-semibold">
                        <Skeleton className="h-6 w-16" />
                    </TabsTrigger>
                    <TabsTrigger value="" className="px-6 font-semibold">
                        <Skeleton className="h-6 w-16" />
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="mt-6 space-y-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index} className="p-4">
                            <CardContent className="space-y-4">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default ProfilePageSkeleton;
