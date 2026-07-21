'use client';

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Image, FileText, X } from "lucide-react";

type Voice = {
    id: string;
    label: string;
    description: string;
    group: 'male' | 'female';
};

const VOICES: Voice[] = [
    { id: 'dave', label: 'Dave', description: 'Warm, steady narration', group: 'male' },
    { id: 'daniel', label: 'Daniel', description: 'Clear, instructional tone', group: 'male' },
    { id: 'chris', label: 'Chris', description: 'Friendly and brisk', group: 'male' },
    { id: 'rachel', label: 'Rachel', description: 'Soft, expressive narration', group: 'female' },
    { id: 'sarah', label: 'Sarah', description: 'Calm and reassuring', group: 'female' },
];

const MAX_PDF_BYTES = 50 * 1024 * 1024; // 50MB

const formSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    author: z.string().min(1, { message: 'Author is required' }),
    voice: z.string().min(1, { message: 'Please choose a voice' }),
    pdf: z
        .any()
        .refine((f) => !f || (f instanceof File && f.size <= MAX_PDF_BYTES), {
            message: 'PDF must be <= 50MB',
        })
        .optional(),
    cover: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UploadForm() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: '', author: '', voice: '', pdf: undefined, cover: undefined },
    });

    const pdf = watch('pdf') as File | undefined;
    const cover = watch('cover') as File | undefined;

    const pdfInputRef = useRef<HTMLInputElement | null>(null);
    const coverInputRef = useRef<HTMLInputElement | null>(null);

    const onSelectPdf = (f?: File) => {
        setValue('pdf', f as any, { shouldValidate: true });
    };

    const onSelectCover = (f?: File) => {
        setValue('cover', f as any);
    };

    const removePdf = () => onSelectPdf(undefined);
    const removeCover = () => onSelectCover(undefined);

    async function onSubmit(values: FormValues) {
        // Show loading overlay automatically via isSubmitting
        // Here you'd normally upload the files and send the metadata to your API.
        await new Promise((r) => setTimeout(r, 1200));
        const payload = {
            title: values.title,
            author: values.author,
            voice: values.voice,
            pdfName: (values.pdf as File | undefined)?.name ?? null,
            coverName: (values.cover as File | undefined)?.name ?? null,
        };
        // eslint-disable-next-line no-console
        console.log('Submitted book payload:', payload);
    }

    return (
        <div className="new-book-wrapper new-book">
            <form
                className="space-y-8"
                onSubmit={handleSubmit(onSubmit)}
                aria-describedby="upload-book-form"
            >
                {/* PDF Dropzone */}
                <div>
                    <label className="form-label">Upload Book PDF</label>
                    <div className="upload-dropzone file-upload-shadow rounded-xl border-dashed border-2 border-[var(--border-subtle)] p-6 flex flex-col items-center justify-center text-center">
                        {!pdf ? (
                            <>
                                <FileText className="icon-sm mb-3 text-[var(--accent-warm)]" />
                                <button
                                    type="button"
                                    className="text-[var(--text-primary)] font-medium"
                                    onClick={() => pdfInputRef.current?.click()}
                                >
                                    Click to upload PDF
                                </button>
                                <p className="text-sm text-[var(--text-secondary)] mt-2">PDF file (max 50MB)</p>
                                <input
                                    ref={pdfInputRef}
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        onSelectPdf(f);
                                    }}
                                />
                            </>
                        ) : (
                            <div className="w-full flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="icon-sm text-[var(--accent-warm)]" />
                                    <div className="text-left">
                                        <div className="font-medium">{pdf.name}</div>
                                        <div className="text-sm text-[var(--text-secondary)]">{(pdf.size / 1024 / 1024).toFixed(2)} MB</div>
                                    </div>
                                </div>
                                <button type="button" className="text-[var(--text-secondary)]" onClick={removePdf} aria-label="Remove PDF">
                                    <X />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cover Dropzone */}
                <div>
                    <label className="form-label">Upload Book Cover Image</label>
                    <div className="upload-dropzone file-upload-shadow rounded-xl border-dashed border-2 border-[var(--border-subtle)] p-6 flex flex-col items-center justify-center text-center">
                        {!cover ? (
                            <>
                                <Image className="icon-sm mb-3 text-[var(--accent-warm)]" />
                                <button
                                    type="button"
                                    className="text-[var(--text-primary)] font-medium"
                                    onClick={() => coverInputRef.current?.click()}
                                >
                                    Click to upload cover image
                                </button>
                                <p className="text-sm text-[var(--text-secondary)] mt-2">Leave empty to auto-generate from PDF</p>
                                <input
                                    ref={coverInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        onSelectCover(f);
                                    }}
                                />
                            </>
                        ) : (
                            <div className="w-full flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Image className="icon-sm text-[var(--accent-warm)]" />
                                    <div className="text-left">
                                        <div className="font-medium">{cover.name}</div>
                                        <div className="text-sm text-[var(--text-secondary)]">{(cover.size / 1024 / 1024).toFixed(2)} MB</div>
                                    </div>
                                </div>
                                <button type="button" className="text-[var(--text-secondary)]" onClick={removeCover} aria-label="Remove cover">
                                    <X />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Title */}
                <div>
                    <label className="form-label">Title</label>
                    <input
                        {...register('title')}
                        placeholder="ex: Rich Dad Poor Dad"
                        className="form-input w-full h-12 rounded-lg border border-[var(--border-subtle)] px-4"
                    />
                    {errors.title && <div className="text-sm text-[var(--destructive)] mt-1">{errors.title.message}</div>}
                </div>

                {/* Author */}
                <div>
                    <label className="form-label">Author Name</label>
                    <input
                        {...register('author')}
                        placeholder="ex: Robert Kiyosaki"
                        className="form-input w-full h-12 rounded-lg border border-[var(--border-subtle)] px-4"
                    />
                    {errors.author && <div className="text-sm text-[var(--destructive)] mt-1">{errors.author.message}</div>}
                </div>

                {/* Voice Selector */}
                <div>
                    <label className="form-label">Choose Assistant Voice</label>
                    <div className="grid grid-cols-1 gap-3">
                        <div>
                            <div className="text-sm font-medium mb-2">Male Voices</div>
                            <div className="flex gap-3">
                                {VOICES.filter((v) => v.group === 'male').map((v) => {
                                    const selected = (watch('voice') || '') === v.id;
                                    return (
                                        <label
                                            key={v.id}
                                            className={`voice-selector-option p-4 rounded-xl border cursor-pointer flex-1 ${
                                                selected ? 'voice-selector-option-selected border-brand' : 'border-[var(--border-subtle)]'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                {...register('voice')}
                                                value={v.id}
                                                className="hidden"
                                                defaultChecked={false}
                                            />
                                            <div className="font-medium">{v.label}</div>
                                            <div className="text-sm text-[var(--text-secondary)]">{v.description}</div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-medium mb-2">Female Voices</div>
                            <div className="flex gap-3">
                                {VOICES.filter((v) => v.group === 'female').map((v) => {
                                    const selected = (watch('voice') || '') === v.id;
                                    return (
                                        <label
                                            key={v.id}
                                            className={`voice-selector-option p-4 rounded-xl border cursor-pointer flex-1 ${
                                                selected ? 'voice-selector-option-selected border-brand' : 'border-[var(--border-subtle)]'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                {...register('voice')}
                                                value={v.id}
                                                className="hidden"
                                                defaultChecked={false}
                                            />
                                            <div className="font-medium">{v.label}</div>
                                            <div className="text-sm text-[var(--text-secondary)]">{v.description}</div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    {errors.voice && <div className="text-sm text-[var(--destructive)] mt-1">{errors.voice.message}</div>}
                </div>

                {/* Submit */}
                <div>
                    <button type="submit" className="form-btn">
                        Begin Synthesis
                    </button>
                </div>
            </form>

            {/* Loading overlay */}
            {isSubmitting && (
                <div className="loading-wrapper">
                    <div className="loading-shadow-wrapper loading-shadow bg-[var(--card)] shadow-soft-md">
                        <div className="flex flex-col items-center space-y-6 p-6">
                            <div className="loading-animation">
                                <svg className="w-12 h-12 text-[var(--color-brand)]" viewBox="0 0 50 50">
                                    <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.4 31.4" />
                                </svg>
                            </div>
                            <div className="loading-title">Synthesizing your book</div>
                            <div className="loading-progress">
                                <div className="loading-progress-item">
                                    <div className="loading-progress-status" />
                                    <div className="text-sm text-[var(--text-secondary)]">Parsing PDF and extracting chapters</div>
                                </div>
                                <div className="loading-progress-item">
                                    <div className="loading-progress-status" />
                                    <div className="text-sm text-[var(--text-secondary)]">Creating interview synthesis</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}