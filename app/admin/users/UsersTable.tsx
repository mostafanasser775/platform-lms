/* eslint-disable @next/next/no-img-element */
'use client'
import { ActionButton } from "@/components/ActionButton";
import { deleteuserAction } from "@/features/users/db/users";
import { Table, TableHeader, TableColumn, TableCell, TableBody, TableRow } from "@heroui/table";

interface User {
    id: string;
    name: string;
    email: string;
    imageUrl: string | null;
    createdAt: Date;
    clerkUserId: string
}

interface UsersTableProps {
    Users: User[];
}

export function UsersTable({ Users }: UsersTableProps) {
    return (
        <>
        <div>
            {
                Users ?
                    <Table aria-label="Users Table" removeWrapper selectionMode="single">
                        <TableHeader>
                            <TableColumn className="px-6 py-4">Profile</TableColumn>
                            <TableColumn className="px-6 py-4">Name</TableColumn>
                            <TableColumn className="px-6 py-4">Email</TableColumn>
                            <TableColumn className="px-6 py-4">Created At</TableColumn>
                            <TableColumn className="px-6 py-4 text-right">Actions</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {Users.map((user) => (
                                <TableRow key={user.id}>
                                    {/* Profile Image */}
                                    <TableCell className="px-6">
                                        <img
                                            src={user.imageUrl || "/default-avatar.png"}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    </TableCell>

                                    {/* Name */}
                                    <TableCell className="px-6">
                                        <div className="font-semibold text-gray-900">{user.name}</div>
                                    </TableCell>

                                    {/* Email */}
                                    <TableCell className="px-6">{user.email}</TableCell>

                                    {/* Created At */}
                                    <TableCell className="px-6">
                                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="px-6 text-right">
                                        <div className="flex items-center gap-3 justify-end">
                                            <ActionButton action={() => deleteuserAction(user.clerkUserId)} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table> :
                    <div> No users Found</div>
            }

        </div>
        </>
    );
}
