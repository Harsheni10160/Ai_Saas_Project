"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Users,
    UserPlus,
    Mail,
    Shield,
    MoreVertical,
    Loader2,
    Crown,
    Trash2,
    Copy,
    Check,
    AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";

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

            // Get active workspace
            const wsRes = await fetch("/api/workspaces/active");
            if (!wsRes.ok) return;

            const activeWs = await wsRes.json();
            setWorkspace(activeWs);

            // Get members
            const membersRes = await fetch(`/api/team/members?workspaceId=${activeWs.id}`);
            if (membersRes.ok) {
                const membersData = await membersRes.json();
                setMembers(membersData);

                // Find current user's role
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

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inviteEmail)) {
            toast.error("Please enter a valid email address");
            return;
        }

        try {
            setInviting(true);
            const inviteUrl = "/api/team/invite";
            console.log("Inviting to:", inviteUrl, {
                workspaceId: workspace.id,
                email: inviteEmail.toLowerCase(),
                role: inviteRole,
            });

            const res = await fetch(inviteUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workspaceId: workspace.id,
                    email: inviteEmail.toLowerCase(),
                    role: inviteRole,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || data.message || "Failed to invite member");
                return;
            }

            toast.success(data.message || "Member invited successfully!");
            setInviteEmail("");
            setInviteRole("MEMBER");
            setShowInviteModal(false);
            fetchTeamData(); // Refresh members list
        } catch (error) {
            console.error("Invite error:", error);
            toast.error("Failed to invite member");
        } finally {
            setInviting(false);
        }
    };

    const handleRemoveMember = async () => {
        if (!memberToRemove) return;

        try {
            setRemoving(true);
            const res = await fetch(`/api/team/members/${memberToRemove.id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                toast.error(data.error || "Failed to remove member");
                return;
            }

            toast.success("Member removed successfully");
            setShowRemoveModal(false);
            setMemberToRemove(null);
            fetchTeamData(); // Refresh members list
        } catch (error) {
            console.error("Remove error:", error);
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

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-pastel-green" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <header className="flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-pastel-blue" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Team</span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-serif font-bold tracking-tight"
                    >
                        Team Members
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-2"
                    >
                        Manage your workspace team and permissions ({members.length} members)
                    </motion.p>
                </div>
                {isOwner && (
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="px-6 py-3 bg-black text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <UserPlus size={20} />
                        Invite Member
                    </button>
                )}
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hi-card p-6"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-pastel-green hi-border rounded-xl">
                            <Users size={20} />
                        </div>
                        <span className="text-sm font-bold text-muted-foreground">Total Members</span>
                    </div>
                    <p className="text-3xl font-bold">{members.length}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="hi-card p-6"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-pastel-yellow hi-border rounded-xl">
                            <Crown size={20} />
                        </div>
                        <span className="text-sm font-bold text-muted-foreground">Owners</span>
                    </div>
                    <p className="text-3xl font-bold">
                        {members.filter(m => m.role === 'OWNER').length}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="hi-card p-6"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-pastel-blue hi-border rounded-xl">
                            <Shield size={20} />
                        </div>
                        <span className="text-sm font-bold text-muted-foreground">Members</span>
                    </div>
                    <p className="text-3xl font-bold">
                        {members.filter(m => m.role === 'MEMBER').length}
                    </p>
                </motion.div>
            </div>

            {/* Members List */}
            <div className="hi-card p-6">
                <h2 className="text-xl font-bold mb-6">Team Members</h2>
                <div className="space-y-3">
                    {members.map((member, idx) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center justify-between p-4 rounded-2xl border-2 border-black/5 hover:border-black/10 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-pastel-green hi-border flex items-center justify-center font-bold text-lg">
                                    {member.user?.name?.[0]?.toUpperCase() || member.user?.email?.[0]?.toUpperCase() || "?"}
                                </div>
                                <div>
                                    <p className="font-bold">{member.user?.name || "Unknown"}</p>
                                    <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 border-black ${member.role === 'OWNER' ? 'bg-pastel-yellow' : 'bg-pastel-blue/20'
                                    }`}>
                                    {member.role === 'OWNER' ? (
                                        <span className="flex items-center gap-1">
                                            <Crown size={12} /> Owner
                                        </span>
                                    ) : 'Member'}
                                </span>
                                {isOwner && member.role !== 'OWNER' && (
                                    <button
                                        onClick={() => {
                                            setMemberToRemove(member);
                                            setShowRemoveModal(true);
                                        }}
                                        className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Invite Modal */}
            <AnimatePresence>
                {showInviteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl border-2 border-black p-8 max-w-md w-full"
                        >
                            <h2 className="text-2xl font-serif font-bold mb-4">Invite Team Member</h2>
                            <p className="text-muted-foreground mb-6">
                                Add a team member to your workspace. They must have an account first.
                            </p>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="colleague@company.com"
                                        className="w-full px-4 py-3 border-2 border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-pastel-green"
                                        disabled={inviting}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Role</label>
                                    <select
                                        value={inviteRole}
                                        onChange={(e) => setInviteRole(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-pastel-green"
                                        disabled={inviting}
                                    >
                                        <option value="MEMBER">Member</option>
                                        <option value="OWNER">Owner</option>
                                    </select>
                                </div>

                                <div className="pt-4 border-t border-black/10">
                                    <p className="text-sm font-bold mb-2">Or share invite link</p>
                                    <button
                                        onClick={copyInviteLink}
                                        className="w-full px-4 py-3 border-2 border-black rounded-2xl font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                                        disabled={inviting}
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                        {copied ? 'Copied!' : 'Copy Invite Link'}
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowInviteModal(false);
                                        setInviteEmail("");
                                        setInviteRole("MEMBER");
                                    }}
                                    className="flex-1 px-6 py-3 border-2 border-black rounded-2xl font-bold hover:bg-secondary transition-colors"
                                    disabled={inviting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleInvite}
                                    disabled={inviting}
                                    className="flex-1 px-6 py-3 bg-black text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {inviting ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Inviting...
                                        </>
                                    ) : (
                                        'Send Invite'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Remove Member Confirmation Modal */}
            <AnimatePresence>
                {showRemoveModal && memberToRemove && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl border-2 border-black p-8 max-w-md w-full"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-destructive/10 rounded-2xl">
                                    <AlertTriangle className="w-6 h-6 text-destructive" />
                                </div>
                                <h2 className="text-2xl font-serif font-bold">Remove Member</h2>
                            </div>

                            <p className="text-muted-foreground mb-6">
                                Are you sure you want to remove <strong>{memberToRemove.user?.name || memberToRemove.user?.email}</strong> from this workspace? They will lose access immediately.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowRemoveModal(false);
                                        setMemberToRemove(null);
                                    }}
                                    className="flex-1 px-6 py-3 border-2 border-black rounded-2xl font-bold hover:bg-secondary transition-colors"
                                    disabled={removing}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRemoveMember}
                                    disabled={removing}
                                    className="flex-1 px-6 py-3 bg-destructive text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {removing ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Removing...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={18} />
                                            Remove
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
