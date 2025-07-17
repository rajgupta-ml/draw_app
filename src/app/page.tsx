import CanvasLayoutWrappedWithProviders from "@/components/ui/canvasLayout";
export default async function HomePage({params} : {params: {id : Promise<string>}}) {
  
  return (
    <div>
        <CanvasLayoutWrappedWithProviders />
    </div>
  );
}
