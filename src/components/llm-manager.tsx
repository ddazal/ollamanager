'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { listModels, getModelInfo, deleteModel, pullModel, generateEmbeddings, Model } from '../actions'

export default function LLMManager() {
    const [models, setModels] = useState<Model[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedModel, setSelectedModel] = useState<string | null>(null)
    const [modelInfo, setModelInfo] = useState<string>('')
    const [newModelName, setNewModelName] = useState<string>('')
    const [embeddingText, setEmbeddingText] = useState<string>('')
    const [embeddings, setEmbeddings] = useState<string>('')

    useEffect(() => {
        fetchModels()
    }, [])

    const fetchModels = async () => {
        try {
            setLoading(true)
            const modelList = await listModels()
            setModels(modelList)
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to list models",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleShowModelInfo = async () => {
        if (!selectedModel) return
        try {
            const info = await getModelInfo(selectedModel)
            setModelInfo(JSON.stringify(info, null, 2))
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to get model information",
                variant: "destructive",
            })
        }
    }

    const handleDeleteModel = async () => {
        if (!selectedModel) return
        try {
            await deleteModel(selectedModel)
            fetchModels() // Refresh the list
            toast({
                title: "Success",
                description: "Model deleted successfully",
            })
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to delete model",
                variant: "destructive",
            })
        }
    }

    const handlePullModel = async () => {
        if (!newModelName) return
        try {
            await pullModel(newModelName)
            fetchModels() // Refresh the list
            setNewModelName('')
            toast({
                title: "Success",
                description: "Model pulled successfully",
            })
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to pull model",
                variant: "destructive",
            })
        }
    }

    const handleGenerateEmbeddings = async () => {
        if (!selectedModel || !embeddingText) return
        try {
            const result = await generateEmbeddings(selectedModel, embeddingText)
            setEmbeddings(JSON.stringify(result, null, 2))
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to generate embeddings",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="container mx-auto p-4 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>LLM Model Manager</CardTitle>
                    <CardDescription>Manage your local LLM models</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {loading ? (
                        <div>Loading models...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Modified at</TableHead>
                                    <TableHead>Family</TableHead>
                                    <TableHead>Parameter size</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {models.map((model) => (
                                    <TableRow key={model.digest}>
                                        <TableCell>{model.name}</TableCell>
                                        <TableCell>{model.size}</TableCell>
                                        <TableCell>{model.modified_at}</TableCell>
                                        <TableCell>{model.family}</TableCell>
                                        <TableCell>{model.parameter_size}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="model-select">Select Model</Label>
                        <Select onValueChange={setSelectedModel} value={selectedModel || undefined}>
                            <SelectTrigger id="model-select">
                                <SelectValue placeholder="Select a model" />
                            </SelectTrigger>
                            <SelectContent>
                                {models.map((model) => (
                                    <SelectItem key={model.digest} value={model.name}>
                                        {model.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-x-2">
                        <Button onClick={handleShowModelInfo}>Show Model Info</Button>
                        <Button onClick={handleDeleteModel} variant="destructive">Delete Model</Button>
                    </div>
                    {modelInfo && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Model Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="whitespace-pre-wrap">{modelInfo}</pre>
                            </CardContent>
                        </Card>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="new-model">Pull New Model</Label>
                        <div className="flex space-x-2">
                            <Input
                                id="new-model"
                                value={newModelName}
                                onChange={(e) => setNewModelName(e.target.value)}
                                placeholder="Enter model name"
                            />
                            <Button onClick={handlePullModel}>Pull Model</Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="embedding-text">Generate Embeddings</Label>
                        <Textarea
                            id="embedding-text"
                            value={embeddingText}
                            onChange={(e) => setEmbeddingText(e.target.value)}
                            placeholder="Enter text for embedding"
                        />
                        <Button onClick={handleGenerateEmbeddings}>Generate Embeddings</Button>
                    </div>
                    {embeddings && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Generated Embeddings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="whitespace-pre-wrap">{embeddings}</pre>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}