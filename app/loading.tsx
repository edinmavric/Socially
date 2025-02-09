import { Skeleton } from '@/components/ui/skeleton';

const HomeSkeleton = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                <div className="lg:col-span-6">
                    <div className="mb-6">
                        <Skeleton className="h-32 w-full rounded-xl bg-muted" />
                    </div>
                    <div className="space-y-6">
                        {[...Array(5)].map((_, index) => (
                            <div
                                key={index}
                                className="p-4 bg-card rounded-xl shadow-sm"
                            >
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="w-10 h-10 rounded-full bg-muted" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-1/3 bg-muted" />
                                        <Skeleton className="h-3 w-1/4 bg-muted" />
                                    </div>
                                </div>
                                <div className="mt-4 space-y-3">
                                    <Skeleton className="h-4 w-full bg-muted" />
                                    <Skeleton className="h-4 w-5/6 bg-muted" />
                                    <Skeleton className="h-4 w-4/6 bg-muted" />
                                </div>
                                <div className="mt-4 flex space-x-4">
                                    <Skeleton className="h-6 w-12 rounded-md bg-muted" />
                                    <Skeleton className="h-6 w-12 rounded-md bg-muted" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeSkeleton;
