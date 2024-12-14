'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useForm, UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form'
import { ZodSchema } from 'zod'

export interface ActionState<T> {
  success: boolean
  message: string
  data?: T
}

interface MutableDialogProps<TFormData extends FieldValues, TResponseData> {
  formSchema: ZodSchema
  FormComponent: React.ComponentType<{ form: UseFormReturn<TFormData> }>
  action: (data: TFormData) => Promise<ActionState<TResponseData>>
  triggerButtonLabel: string
  addDialogTitle: string
  editDialogTitle: string
  dialogDescription: string
  submitButtonLabel: string
  defaultValues?: DefaultValues<TFormData>
  isSubmitting: boolean
  onNotification: (notification: { type: 'success' | 'error', message: string } | null) => void
}

export default function MutableDialog<TFormData extends FieldValues, TResponseData>({
  formSchema,
  FormComponent,
  action,
  triggerButtonLabel,
  addDialogTitle,
  editDialogTitle,
  dialogDescription,
  submitButtonLabel,
  defaultValues,
  isSubmitting,
  onNotification,
}: MutableDialogProps<TFormData, TResponseData>) {
  const [open, setOpen] = useState(false)
  const form = useForm<TFormData>({
    resolver: async (values) => {
      try {
        const result = formSchema.parse(values)
        return { values: result, errors: {} }
      } catch (err: any) {
        return { values: {}, errors: err.formErrors?.fieldErrors }
      }
    },
    defaultValues: defaultValues,
  })

  const onSubmit = async (data: TFormData) => {
    const result = await action(data)
    if (result.success) {
      form.reset()
      setOpen(false)
      onNotification({ type: 'success', message: result.message })
    } else {
      onNotification({ type: 'error', message: result.message })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) {
        onNotification(null)
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerButtonLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues ? editDialogTitle : addDialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormComponent form={form} />
          <div className="mt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : submitButtonLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

