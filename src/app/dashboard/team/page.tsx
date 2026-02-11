"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Users,
    UserPlus,
    MoreVertical,
    Loader2,
    Crown,
    Trash2,
    Copy,
    Check,
    AlertTriangle,
    Mail,
    Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function TeamPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [workspace, setWorkspace] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<any>(null);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("MEMBER");
    const [inviting, setInviting] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [copied, setCopied] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

    useEffect(() => {
        fetchTeamData();
    }, []);

    const fetchTeamData = async () => {
        try {
            setLoading(true);
            const wsRes = await fetch("/api/workspaces/active");
            if (!wsRes.ok) throw new Error("No active workspace");
            const activeWs = await wsRes.json();
            setWorkspace(activeWs);

            const membersRes = await fetch(`/api/team/members?workspaceId=${activeWs.id}`);
            if (membersRes.ok) {
                const membersData = await membersRes.json();
                setMembers(membersData);
                const currentMember = membersData.find((m: any) => m.userId === session?.user?.id);
                setCurrentUserRole(currentMember?.role || null);
            }
        } catch (error) {
            console.error("Team error:", error);
            toast.error("Failed to load team data");
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async () => {
        if (!inviteEmail.trim()) {
            toast.error("Please enter an email address");
            return;
        }

        try {
            setInviting(true);
            const res = await fetch("/api/team/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workspaceId: workspace.id,
                    email: inviteEmail.toLowerCase(),
                    role: inviteRole,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to invite member");

            toast.success("Member invited successfully!");
            setInviteEmail("");
            setShowInviteModal(false);
            fetchTeamData();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setInviting(false);
        }
    };

    const handleRemoveMember = async () => {
        if (!memberToRemove) return;
        try {
            setRemoving(true);
            await fetch(`/api/team/members/${memberToRemove.id}`, { method: "DELETE" });
            toast.success("Member removed successfully");
            setShowRemoveModal(false);
            setMemberToRemove(null);
            fetchTeamData();
        } catch (error) {
            toast.error("Failed to remove member");
        } finally {
            setRemoving(false);
        }
    };

    const copyInviteLink = () => {
        const inviteLink = `${window.location.origin}/invite?workspace=${workspace?.id}`;
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        toast.success("Invite link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const isOwner = currentUserRole === "OWNER";

    if (loading) return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Team Members</h1>
                    <p className="text-zinc-500 mt-1">Manage access and roles for your workspace.</p>
                </div>
                {isOwner && (
                    <Button onClick={() => setShowInviteModal(true)} className="bg-zinc-900 text-white hover:bg-zinc-800">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite Member
                    </Button>
                )}
            </div>

            <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="grid grid-cols-12 gap-4 p-4 bg-zinc-50/50 border-b border-zinc-200 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <div className="col-span-5">User</div>
                    <div className="col-span-4">Role</div>
                    <div className="col-span-2">Joined</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>

                <div className="divide-y divide-zinc-100">
                    {members.map((member) => (
                        <div key={member.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-zinc-50 transition-colors group">
                            <div className="col-span-5 flex items-center gap-3">
                                <Avatar className="h-9 w-9 border border-zinc-200">
                                    <AvatarFallback className="bg-zinc-100 text-zinc-600 font-medium text-xs">
                                        {member.user?.name?.[0]?.toUpperCase() || member.user?.email?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-zinc-900 truncate">{member.user?.name || "Unknown"}</p>
                                    <p className="text-xs text-zinc-500 truncate">{member.user?.email}</p>
                                </div>
                            </div>
                            <div className="col-span-4">
                                <Badge variant="secondary" className={`
                                    ${member.role === 'OWNER' ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}
                                    border-transparent font-medium
                                `}>
                                    {member.role === 'OWNER' ? <Crown className="w-3 h-3 mr-1 inline" /> : null}
                                    {member.role.charAt(0) + member.role.slice(1).toLowerCase()}
                                </Badge>
                            </div>
                            <div className="col-span-2 text-sm text-zinc-500">
                                {new Date(member.joinedAt || Date.now()).toLocaleDateString()}
                            </div>
                            <div className="col-span-1 text-right">
                                {isOwner && member.role !== 'OWNER' && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-600">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                onClick={() => {
                                                    setMemberToRemove(member);
                                                    setShowRemoveModal(true);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Remove Member
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Invite Modal */}
            <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite Team Member</DialogTitle>
                        <DialogDescription>
                            Send an invitation email to add a new member to your workspace.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input
                                placeholder="colleague@company.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Role</label>
                            <Select value={inviteRole} onValueChange={setInviteRole}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MEMBER">Member</SelectItem>
                                    <SelectItem value="OWNER">Owner</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-2">
                            <Button variant="outline" className="w-full" onClick={copyInviteLink}>
                                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? 'Link Copied' : 'Copy Invite Link'}
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowInviteModal(false)}>Cancel</Button>
                        <Button onClick={handleInvite} disabled={inviting} className="bg-zinc-900 text-white">
                            {inviting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Send Invite
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Remove Modal */}
            <Dialog open={showRemoveModal} onOpenChange={setShowRemoveModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Remove Member
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove <strong>{memberToRemove?.user?.name || memberToRemove?.user?.email}</strong>? They will lose access immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowRemoveModal(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={handleRemoveMember}
                            disabled={removing}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {removing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
