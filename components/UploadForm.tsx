'use client';

import React, { useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, FileText, X } from "lucide-react";
import {useAuth} from "@clerk/nextjs";
import {toast} from 'sonner'
import {checkBookExists, createBook, saveBookSegments} from "@/lib/actions/book.actions";
import {useRouter} from "next/navigation";
import {upload} from "@vercel/blob/client";
import {parsePDFFile} from "@/lib/utils";


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
    persona: z.string().min(1, { message: 'Please choose a voice' }),
    pdf: z
        .any()
        .refine((f) => f instanceof File, {
            message: 'PDF is required',
        })
        .refine((f) => f instanceof File && f.size <= MAX_PDF_BYTES, {
            message: 'PDF must be <= 50MB',
        }),
    cover: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UploadForm() {
    const {
        register,
        handleSubmit,
        setValue,
        resetField,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: '', author: '', persona: '', pdf: undefined, cover: undefined },
    });

    const pdf = useWatch({ control, name: 'pdf' }) as File | undefined;
    const cover = useWatch({ control, name: 'cover' }) as File | undefined;
    const selectedPersona = useWatch({ control, name: 'persona' }) ?? '';

    const {userId} = useAuth();
    const router = useRouter();

    const pdfInputRef = useRef<HTMLInputElement | null>(null);
    const coverInputRef = useRef<HTMLInputElement | null>(null);

    const onSelectPdf = (f?: File) => {
        if (f) {
            setValue('pdf', f, { shouldValidate: true });
            return;
        }

        resetField('pdf');
    };

    const onSelectCover = (f?: File) => {
        setValue('cover', f);
    };

    const removePdf = () => {
        onSelectPdf(undefined);
        if (pdfInputRef.current) {
            pdfInputRef.current.value = '';
        }
    };
    const removeCover = () => {
        onSelectCover(undefined);
        if (coverInputRef.current) {
            coverInputRef.current.value = '';
        }
    };

    async function onSubmit(values: FormValues) {
        if(!userId){
           return toast.error("Please sign in to upload books");
        }

        try{
            const existsCheck = await checkBookExists(values.title);
            if(existsCheck.exists && existsCheck.data){
                toast.error("Book already exists. Please try another title.");
                router.push(`/books/${existsCheck.data.slug}`);
                return;
            }

            const fileTitle = values.title.replace(/\s+/g, '-').toLowerCase();
            const pdfFile = values.pdf;

            const parsedPDF = await parsePDFFile(pdfFile);

            if(parsedPDF.content.length === 0){
                toast.error("Failed to parse PDF. Please check the PDF and try again.");
                return;
            }

            const uploadedPdfBlob = await  upload(fileTitle, pdfFile,{
                access: 'public',
                handleUploadUrl: '/api/upload',
                contentType: 'application/pdf',
              
            });

            let coverUrl: string;
            let coverBlobKey: string | undefined;
            if(values.cover){
                const coverFile = values.cover;
                const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, coverFile,{
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                    contentType: coverFile.type,
                    
                });
                coverUrl = uploadedCoverBlob.url;
                coverBlobKey = uploadedCoverBlob.pathname;
            }else{
                const response = await fetch(parsedPDF.cover);
                const blob = await response.blob();

                const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, blob,{
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                    contentType: 'image/png',
                    
                })
                coverUrl = uploadedCoverBlob.url;
                coverBlobKey = uploadedCoverBlob.pathname;
            }

            const createBookResult = await createBook({
                clerkId: userId,
                title: values.title,
                author: values.author,
                persona: values.persona,
                fileURL: uploadedPdfBlob.url,
                fileBlobKey: uploadedPdfBlob.pathname,
                coverURL: coverUrl,
                coverBlobKey,
                fileSize: pdfFile.size,
            });

            if (!createBookResult.success || !createBookResult.data) {
                toast.error("Failed to save book details. Please try again.");
                return;
            }

            if (!createBookResult.alreadyExists) {
                const bookId = createBookResult.data._id ?? createBookResult.data.id;
                if (!bookId) {
                    toast.error("Failed to save book segments. Please try again.");
                    return;
                }

                const segmentsResult = await saveBookSegments(bookId, userId, parsedPDF.content);
                if (!segmentsResult?.success) {
                    toast.error("Failed to save book segments. Please try again.");
                    return;
                }
            }

            reset();
            toast.success("Book uploaded successfully.");
            router.push(`/books/${createBookResult.data.slug}`);
        }catch(error){
            console.log(error);
            toast.error("Something went wrong. Please try again later.");
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
            <div className="rounded-3xl border border-border/70 bg-card/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
                
                {/* Header Title */}
                <div className="border-b border-border/50 pb-6 text-center sm:text-left">
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                        Upload New Book
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Add a PDF book to your library to generate vector embeddings and enable voice & text AI conversations.
                    </p>
                </div>

                <form
                    className="space-y-8"
                    onSubmit={handleSubmit(onSubmit)}
                    aria-describedby="upload-book-form"
                >
                    {/* PDF Dropzone */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground flex items-center justify-between">
                            <span>Book PDF File</span>
                            <span className="text-xs font-medium text-muted-foreground">Max 50MB</span>
                        </label>

                        <div 
                            onClick={() => !pdf && pdfInputRef.current?.click()}
                            className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-7 text-center transition-all duration-200 cursor-pointer ${
                                pdf 
                                    ? 'border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20' 
                                    : 'border-border/80 hover:border-amber-700/60 hover:bg-muted/40'
                            }`}
                        >
                            {!pdf ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 shadow-sm group-hover:scale-110 transition-transform">
                                        <FileText className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-foreground">
                                            Click to upload PDF
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Supports searchable PDF files with text
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-800 text-white shadow-sm">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="text-left min-w-0">
                                            <p className="font-bold text-foreground text-sm truncate">{pdf.name}</p>
                                            <p className="text-xs text-muted-foreground">{(pdf.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removePdf();
                                        }} 
                                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-background border border-border/80 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer" 
                                        aria-label="Remove PDF"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

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
                        </div>
                        {errors.pdf && <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1">{errors.pdf.message?.toString()}</p>}
                    </div>

                    {/* Cover Image Dropzone */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground flex items-center justify-between">
                            <span>Book Cover Image (Optional)</span>
                            <span className="text-xs font-medium text-muted-foreground">Auto-generated if empty</span>
                        </label>

                        <div 
                            onClick={() => !cover && coverInputRef.current?.click()}
                            className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 cursor-pointer ${
                                cover 
                                    ? 'border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20' 
                                    : 'border-border/80 hover:border-amber-700/60 hover:bg-muted/40'
                            }`}
                        >
                            {!cover ? (
                                <div className="flex flex-col items-center gap-2.5">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground group-hover:scale-110 transition-transform">
                                        <ImageIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">
                                            Upload cover image
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            PNG, JPG, or WEBP (Max 10MB)
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-800/20 text-amber-900 dark:text-amber-200 shadow-xs">
                                            <ImageIcon className="h-5 w-5" />
                                        </div>
                                        <div className="text-left min-w-0">
                                            <p className="font-bold text-foreground text-sm truncate">{cover.name}</p>
                                            <p className="text-xs text-muted-foreground">{(cover.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeCover();
                                        }} 
                                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-background border border-border/80 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer" 
                                        aria-label="Remove cover"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

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
                        </div>
                    </div>

                    {/* Book Metadata Inputs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Book Title</label>
                            <input
                                {...register('title')}
                                placeholder="ex: Clean Code"
                                className="w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 outline-none transition-all focus:border-amber-700/60 focus:ring-2 focus:ring-amber-700/20 dark:focus:border-amber-400/60 dark:focus:ring-amber-400/20"
                            />
                            {errors.title && <p className="text-xs font-semibold text-red-600 dark:text-red-400">{errors.title.message}</p>}
                        </div>

                        {/* Author */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Author Name</label>
                            <input
                                {...register('author')}
                                placeholder="ex: Robert C. Martin"
                                className="w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 outline-none transition-all focus:border-amber-700/60 focus:ring-2 focus:ring-amber-700/20 dark:focus:border-amber-400/60 dark:focus:ring-amber-400/20"
                            />
                            {errors.author && <p className="text-xs font-semibold text-red-600 dark:text-red-400">{errors.author.message}</p>}
                        </div>
                    </div>

                    {/* Voice Selection Cards */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground">Choose AI Assistant Voice</label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Male Voices */}
                            <div className="space-y-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Male Voices</span>
                                <div className="space-y-2">
                                    {VOICES.filter((v) => v.group === 'male').map((v) => {
                                        const selected = selectedPersona === v.id;
                                        return (
                                            <label
                                                key={v.id}
                                                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                                                    selected 
                                                        ? 'bg-amber-100/70 border-amber-800/80 dark:bg-amber-950/60 dark:border-amber-400/70 shadow-sm' 
                                                        : 'border-border/70 hover:bg-muted/50'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    {...register('persona')}
                                                    value={v.id}
                                                    className="mt-1"
                                                />
                                                <div>
                                                    <p className="font-bold text-sm text-foreground">{v.label}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{v.description}</p>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Female Voices */}
                            <div className="space-y-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Female Voices</span>
                                <div className="space-y-2">
                                    {VOICES.filter((v) => v.group === 'female').map((v) => {
                                        const selected = selectedPersona === v.id;
                                        return (
                                            <label
                                                key={v.id}
                                                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                                                    selected 
                                                        ? 'bg-amber-100/70 border-amber-800/80 dark:bg-amber-950/60 dark:border-amber-400/70 shadow-sm' 
                                                        : 'border-border/70 hover:bg-muted/50'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    {...register('persona')}
                                                    value={v.id}
                                                    className="mt-1"
                                                />
                                                <div>
                                                    <p className="font-bold text-sm text-foreground">{v.label}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{v.description}</p>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        {errors.persona && <p className="text-xs font-semibold text-red-600 dark:text-red-400">{errors.persona.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full py-4 px-6 rounded-2xl bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-600 text-white font-bold text-base shadow-xl shadow-amber-900/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmitting ? "Synthesizing PDF & Generating Embeddings..." : "Upload & Synthesize Book"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Loading Overlay */}
            {isSubmitting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-2xl border border-border/80 text-center space-y-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 mx-auto animate-pulse">
                            <FileText className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="font-serif text-xl font-bold text-foreground">Synthesizing Your Book</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Extracting text, page numbers, and generating vector embeddings...
                            </p>
                        </div>
                        <div className="space-y-2 text-xs font-semibold text-muted-foreground">
                            <div className="flex items-center justify-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-amber-600 animate-ping" />
                                <span>Structure-aware page chunking</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-orange-600 animate-ping" />
                                <span>Vector embedding generation</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
