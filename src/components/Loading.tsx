export function Loading() {
    return (
        <main className="flex-1 flex items-center justify-center mt-16">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#0052FF] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[#6B7280]">Loading...</p>
            </div>
        </main>
    )
}