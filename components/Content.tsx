import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function Content({templateId, content} : {templateId: string, content: string}) {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message-2">{}</Label>
      <Textarea className="bg-black text-white" defaultValue={content} id="message-2" rows={20} cols={40} />
      <p className="text-sm text-muted-foreground">
        Proposal {templateId}
      </p>
    </div>
  )
}
