'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Memory } from "@/lib/types";
import { Eye, PlusCircle, Save } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Drawer } from "vaul";

type SortColumn = keyof Memory;

export default function Resources() {
    const [memories, setMemories] = useState<Memory[]>(() => {
        fetch('/api/resources')
            .then(res => res.json())
            .then(data => setMemories(data.memories))
            .catch(error => console.error('Error fetching memories:', error));
        return [];
    })
    const [searchTerm, setSearchTerm] = useState("")
    const [sortColumn, setSortColumn] = useState<SortColumn>("title")
    const [sortDirection, setSortDirection] = useState("asc")
    const [title, setTitle] = useState("")
    const [data, setData] = useState("")

    const filteredMemories = useMemo(() => {
        return memories?.filter((memory) =>
            memory.title.toLowerCase().includes(searchTerm.toLowerCase()),
        )
    }, [memories, searchTerm])

    const sortedMemories = useMemo(() => {
        return filteredMemories?.sort((a, b) => {
            if (a[sortColumn]! < b[sortColumn]!) return sortDirection === "asc" ? -1 : 1
            if (a[sortColumn]! > b[sortColumn]!) return sortDirection === "asc" ? 1 : -1
            return 0
        })
    }, [filteredMemories, sortColumn, sortDirection])

    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortColumn(column)
            setSortDirection("asc")
        }
    }

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Saving memory:", { title, data });

        const response = await fetch('/api/resources', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, data }),
        })

        console.log({ response });
    }

    return (
        <>
            <div className="w-full flex justify-between">
                <SidebarTrigger />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="default"><PlusCircle /> add memory</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>new memory</DialogTitle>
                            <DialogDescription>
                                add evrything you want to be remember later on.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    title
                                </Label>
                                <Input
                                    id="title"
                                    defaultValue="memory title"
                                    className="col-span-3"
                                    onChange={(e) => {
                                        setTitle(e.target.value)
                                    }}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="data" className="text-right">
                                    data
                                </Label>
                                <Input
                                    id="data"
                                    defaultValue="memory data"
                                    className="col-span-3"
                                    onChange={(e) => {
                                        setData(e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={(e) => handleSave(e)}><Save /> save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="mx-auto my-6 w-full max-w-6xl rounded border">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b p-4 md:py-2">
                    <h1 className="text-xl font-bold">memories</h1>
                    <Input
                        placeholder="search memories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="md:w-96"
                    />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead
                                className="cursor-pointer"
                                onClick={() => handleSort("title")}
                            >
                                title
                                {sortColumn === "title" && (
                                    <span className="ml-1">
                                        {sortDirection === "asc" ? "\u2191" : "\u2193"}
                                    </span>
                                )}
                            </TableHead>
                            <TableHead
                                className="cursor-pointer"
                                onClick={() => handleSort("data")}
                            >
                                data
                                {sortColumn === "data" && (
                                    <span className="ml-1">
                                        {sortDirection === "asc" ? "\u2191" : "\u2193"}
                                    </span>
                                )}
                            </TableHead>
                            <TableHead>actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedMemories?.map((memory) => (
                            <TableRow key={memory.id}>
                                <TableCell>
                                    {memory.title}
                                </TableCell>
                                <TableCell>
                                    {JSON.stringify(memory.data)}
                                </TableCell>
                                <TableCell>
                                    <Drawer.Root direction="right">
                                        <Drawer.Trigger><Eye size={14} /></Drawer.Trigger>
                                        <Drawer.Portal>
                                            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                                            <Drawer.Content
                                                className="right-2 top-2 bottom-2 fixed z-10 outline-none w-[310px] flex"
                                                style={{ '--initial-transform': 'calc(100% + 8px)' } as React.CSSProperties}
                                            >
                                                <div className="bg-zinc-50 h-full w-full grow p-5 flex flex-col rounded-[16px]">
                                                    <div className="max-w-md mx-auto">
                                                        <Drawer.Title className="font-medium mb-2 text-zinc-900">wip</Drawer.Title>
                                                        <Drawer.Description className="text-zinc-600 mb-2">
                                                            registered memories for this record.
                                                        </Drawer.Description>
                                                    </div>
                                                </div>
                                            </Drawer.Content>
                                        </Drawer.Portal>
                                    </Drawer.Root>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}