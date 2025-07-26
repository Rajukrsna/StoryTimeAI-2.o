"use client"

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { createAIStory } from "@/api/aiApi";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaFeatherAlt, 
  FaRobot, 

  FaMagic,
 
  FaCamera
} from "react-icons/fa";
import { 
  X, 
  Sparkles, 
  FileText, 
  Upload, 
  Wand2, 
  BookMarked,
  ImageIcon,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function CreatePage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [collaborationInstructions, setCollaborationInstructions] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>("");
                   const currentStep = 1;

    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type.startsWith('image/')) {
                setFile(droppedFile);
                setPreviewUrl(URL.createObjectURL(droppedFile));
            }
        }
    };

    const handleUpload = async () => {
        if (!file) return null;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "unsigned_preset");

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dneqrmfuv/image/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.secure_url) {
                console.log("Uploaded image URL:", data.secure_url);
                return data.secure_url;
            } else {
                alert("Cloudinary upload failed");
                return null;
            }
        } catch (error) {
            console.error("Upload error:", error);
            return null;
        }
    };

    const handleCreate = async () => {
        setIsLoading(true);

        try {
            const imageUrl = await handleUpload();
            console.log("Uploaded image URL:", imageUrl);

            if (!imageUrl) {
                alert("Please upload a cover image!");
                setIsLoading(false);
                return;
            }
            const response = await createAIStory(title, description);
            if (response) {
                router.push(`/aiPage?summary=${encodeURIComponent(response.summary)}&story=${encodeURIComponent(response.suggestion)}&title=${encodeURIComponent(title)}&imageUrl=${encodeURIComponent(imageUrl)}&collaborationInstructions=${encodeURIComponent(collaborationInstructions)}`);  
            } else {
                alert("AI generation failed!");
            }
        } catch (error) {
            console.log("Error creating story:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = title && description && file;

    const steps = [
        { id: 1, title: "Story Details", icon: BookMarked },
        { id: 2, title: "Collaboration", icon: Users },
        { id: 3, title: "Cover Image", icon: ImageIcon },
        { id: 4, title: "Create", icon: Wand2 }
    ];

    return (
        <main className="min-h-screen pt-16 lg:pt-18 bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 font-sans">
            <Navbar />

            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-200/30 to-gray-300/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-gray-100/40 to-gray-200/30 rounded-full blur-2xl"></div>
            </div>

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            AI-Powered Story Creation
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 mb-4">
                        <span className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent">
                            Create Your Epic Story
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Transform your ideas into captivating stories with the power of AI and community collaboration
                    </p>
                </motion.div>

                {/* Progress Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="flex justify-center">
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-white/30">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isCompleted = index < currentStep - 1;
                                const isCurrent = index === currentStep - 1;
                                return (
                                    <div key={step.id} className="flex items-center">
                                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                                            isCurrent 
                                                ? 'bg-gray-800 text-white shadow-lg' 
                                                : isCompleted 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'text-gray-500'
                                        }`}>
                                            {isCompleted ? (
                                                <CheckCircle className="w-4 h-4" />
                                            ) : (
                                                <Icon className="w-4 h-4" />
                                            )}
                                            <span className="text-sm font-medium hidden sm:inline">
                                                {step.title}
                                            </span>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className="w-8 h-px bg-gray-300 mx-1"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* Main Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center"
                >
                    <Card className="w-full max-w-4xl bg-white/80 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/50 p-8">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl">
                                    <FaFeatherAlt className="text-2xl text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                                        Story Creation Workshop
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 text-lg">
                                        Lets bring your story to life with AI assistance 
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8 space-y-8">
                            {/* Story Title */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                                        <BookMarked className="w-5 h-5 text-white" />
                                    </div>
                                    <Label htmlFor="title" className="text-lg font-semibold text-gray-800">
                                        Story Title
                                    </Label>
                                </div>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="Enter a captivating title for your story..."
                                    className="h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-gray-400 bg-white/70 backdrop-blur-sm transition-all duration-300"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                {title && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center gap-2 text-green-600"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="text-sm font-medium">Great title!</span>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Story Description */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <Label htmlFor="description" className="text-lg font-semibold text-gray-800">
                                        Story Description
                                    </Label>
                                </div>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your story idea, setting, characters, or plot. The more detail you provide, the better our AI can help craft your narrative..."
                                    className="h-40 text-base resize-none rounded-2xl border-2 border-gray-200 focus:border-gray-400 bg-white/70 backdrop-blur-sm transition-all duration-300"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>{description.length} characters</span>
                                    {description.length > 50 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center gap-2 text-green-600"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="font-medium">Good detail level!</span>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Collaboration Instructions */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                    <Label htmlFor="instructions" className="text-lg font-semibold text-gray-800">
                                        Collaboration Guidelines 
                                        <span className="text-sm font-normal text-gray-600 ml-2">(Optional)</span>
                                    </Label>
                                </div>
                                <Textarea
                                    id="instructions"
                                    placeholder="Set guidelines for collaborators: tone, style, character rules, plot constraints, etc. Example: 'Keep the tone light and humorous. Avoid introducing new main characters without discussion.'"
                                    className="h-32 text-base resize-none rounded-2xl border-2 border-gray-200 focus:border-gray-400 bg-white/70 backdrop-blur-sm transition-all duration-300"
                                    value={collaborationInstructions}
                                    onChange={(e) => setCollaborationInstructions(e.target.value)}
                                />
                            </motion.div>

                            {/* Cover Image Upload */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                                        <FaCamera className="w-5 h-5 text-white" />
                                    </div>
                                    <Label htmlFor="cover" className="text-lg font-semibold text-gray-800">
                                        Cover Image
                                    </Label>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Upload Area */}
                                    <div
                                        className={`relative border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                                            dragActive 
                                                ? 'border-gray-400 bg-gray-50' 
                                                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                        }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            id="cover"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="space-y-4">
                                            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center">
                                                <Upload className="w-8 h-8 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-semibold text-gray-800 mb-2">
                                                    Drop your cover image here
                                                </p>
                                                <p className="text-gray-600">
                                                    or click to browse files
                                                </p>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Supports JPG, PNG up to 10MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    <div className="space-y-4">
                                        {previewUrl ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="relative"
                                            >
                                                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Cover Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setFile(null);
                                                        setPreviewUrl("");
                                                    }}
                                                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex items-center gap-2 text-green-600 mt-3"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Perfect! Your cover looks great</span>
                                                </motion.div>
                                            </motion.div>
                                        ) : (
                                            <div className="aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                                                <div className="text-center text-gray-500">
                                                    <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                                                    <p className="text-sm">Preview will appear here</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </CardContent>

                        <CardFooter className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-200/50 p-8">
                            <div className="w-full space-y-4">
                                {/* Validation Messages */}
                                {!isFormValid && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded-xl p-4 border border-amber-200"
                                    >
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-sm font-medium">
                                            Please complete all required fields to create your story
                                        </span>
                                    </motion.div>
                                )}

                                {/* Create Button */}
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        onClick={handleCreate}
                                        disabled={isLoading || !isFormValid}
                                        size="lg"
                                        className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-gray-800 text-white rounded-2xl shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-3">
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                <span>Creating Your Story...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <FaMagic className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                                <span>Create Story with AI</span>
                                                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                            </div>
                                        )}
                                    </Button>
                                </motion.div>
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>

            {/* Enhanced Loading Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-200/50 text-center max-w-md mx-4"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-20 h-20 mx-auto mb-8"
                            >
                                <div className="w-full h-full bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center">
                                    <FaRobot className="text-3xl text-white" />
                                </div>
                            </motion.div>
                            
                            <motion.h3
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-2xl font-bold text-gray-800 mb-4"
                            >
                                AI is crafting your story...
                            </motion.h3>
                            
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Our AI is analyzing your description and creating the perfect opening chapter. 
                                This may take a few moments.
                            </p>
                            
                            <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                                <motion.div
                                    animate={{ x: [-100, 300] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-24 h-full bg-gradient-to-r from-gray-600 to-gray-800 rounded-full"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

           
        </main>
    );
}