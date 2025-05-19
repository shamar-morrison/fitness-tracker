"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTemplates } from "@/hooks/useTemplates"
import { useAuth } from "@/hooks/useAuth"
import { TemplateForm } from "@/components/templates/TemplateForm"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EditTemplatePage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { getTemplate, loading } = useTemplates()
  const [template, setTemplate] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTemplate = async () => {
      if (user && id) {
        const data = await getTemplate(id as string)
        setTemplate(data)
        setIsLoading(false)
      }
    }

    fetchTemplate()
  }, [user, id, getTemplate])

  if (isLoading || loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Template Not Found</h1>
        </div>
        <p>The template you are looking for does not exist or you don&apos;t have permission to view it.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Template</h1>
      </div>
      <TemplateForm template={template} />
    </div>
  )
}
