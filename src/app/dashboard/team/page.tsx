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
    Check
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function TeamPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [workspace, setWorkspace] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchTeamData();
    }, []);

    const fetchTeamData = async () => {
        try {
            setLoading(true);
            const wsRes = await fetch("/api/workspaces");
            const wsData = await wsRes.json();

            if (wsData && wsData.length > 0) {
                const activeWs = wsData[0];
                setWorkspace(activeWs);
                setMembers(activeWs.members || []);
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

        toast.success(`Invite sent to ${inviteEmail}!`);
        setInviteEmail("");
        setShowInviteModal(false);
    };

    const copyInviteLink = () => {
        const inviteLink = `${window.location.origin}/invite/${workspace?.id}`;
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        toast.success("Invite link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-pastel-green" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex items-end justify-between">
                <div>
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
                        Manage your workspace team and permissions
                    </motion.p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="px-6 py-3 bg-black text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                    <UserPlus size={20} />
                    Invite Member
                </button>
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
                        <div className="p-2 bg-pastel-blue hi-border rounded-xl">
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
                        <div className="p-2 bg-pastel-yellow hi-border rounded-xl">
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
                                    {member.user?.name?.[0]?.toUpperCase() || "?"}
                                </div>
                                <div>
                                    <p className="font-bold">{member.user?.name || "Unknown"}</p>
                                    <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 border-black ${member.role === 'OWNER' ? 'bg-pastel-yellow' : 'bg-secondary'
                                    }`}>
                                    {member.role === 'OWNER' ? (
                                        <span className="flex items-center gap-1">
                                            <Crown size={12} /> Owner
                                        </span>
                                    ) : 'Member'}
                                </span>
                                {member.role !== 'OWNER' && (
                                    <button className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl border-2 border-black p-8 max-w-md w-full"
                    >
                        <h2 className="text-2xl font-serif font-bold mb-4">Invite Team Member</h2>
                        <p className="text-muted-foreground mb-6">
                            Send an invitation to join your workspace
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
                                />
                            </div>

                            <div className="pt-4 border-t border-black/10">
                                <p className="text-sm font-bold mb-2">Or share invite link</p>
                                <button
                                    onClick={copyInviteLink}
                                    className="w-full px-4 py-3 border-2 border-black rounded-2xl font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                    {copied ? 'Copied!' : 'Copy Invite Link'}
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="flex-1 px-6 py-3 border-2 border-black rounded-2xl font-bold hover:bg-secondary transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleInvite}
                                className="flex-1 px-6 py-3 bg-black text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all"
                            >
                                Send Invite
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
