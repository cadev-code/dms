import React, { useState } from 'react';
import { cn } from '@/lib/utils';

import type { Folder as FolderType } from '@/types/folder.types';

import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';

import { Button } from '../ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useRenameFolder } from '@/hooks/useRenameFolder';
import { useCreateFolder } from '@/hooks/useCreateFolder';
import { FolderDeleteDialog } from './FolderDeleteDialog';
import { useDeleteFolder } from '@/hooks/useDeleteFolder';

interface Props {
  activeFilter: string;
  folder: FolderType;
  level: number;
  isExpanded: (folderId: number) => boolean;
  onFolderClick: (filter: string) => void;
  onFolderExpanded: (folder: FolderType) => void;
}

const isAdmin = true;

export const FolderTreeItem = ({
  activeFilter,
  folder,
  isExpanded,
  level,
  onFolderClick,
  onFolderExpanded,
}: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editName, setEditName] = useState(folder.folderName);

  const [isAddingSubfolder, setIsAddingSubfolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isActive = activeFilter === `folder:${folder.id}`;
  const hasChildren = folder.children && folder.children.length > 0;

  const createFolder = useCreateFolder();
  const renameFolder = useRenameFolder();
  const deleteFolder = useDeleteFolder();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFolderExpanded(folder);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (editName === '') return;
      if (folder.folderName === editName) return;

      renameFolder.mutate({
        folderName: editName,
        id: folder.id,
      });

      setIsEditing(false);
      setEditName('');
    }
  };

  const handleAddSubfolder = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (newFolderName === '') return;

      createFolder.mutate({
        folderName: newFolderName,
        parentId: folder.id,
      });

      setIsAddingSubfolder(false);
      setNewFolderName('');
    }
  };

  const handleConfirmDelete = () => {
    deleteFolder.mutate({ folderId: folder.id });
    onFolderClick('all');
  };

  return (
    <div className="select-none">
      <Collapsible open={isExpanded(folder.id)}>
        <div
          className={cn(
            'group flex items-center gap-1 py-1.5 px-2 rounded-md cursor-pointer transition-colors',
            isActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => onFolderClick(`folder:${folder.id}`)}
        >
          {/* Expand/Collapse button */}
          <CollapsibleTrigger asChild onClick={handleToggle}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-5 w-5 p-0 hover:bg-transparent hover:text-green-500',
                !hasChildren && !isAdmin && 'invisible',
              )}
            >
              {isExpanded(folder.id) ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </Button>
          </CollapsibleTrigger>

          {/* Folder icon */}
          {isExpanded(folder.id) ? (
            <FolderOpen className="h-4 w-4 text-primary shrink-0" />
          ) : (
            <Folder className="h-4 w-4 text-primary shrink-0" />
          )}

          {/* Folder name or edit input */}
          {isEditing ? (
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={() => {
                setIsEditing(false);
                setEditName(folder.folderName);
              }}
              onKeyDown={handleInputKeyDown}
              className="h-6 py-0 text-sm flex-1 bg-sidebar-accent border-sidebar-border"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="flex-1 truncate text-sm" title={folder.folderName}>
              {folder.folderName}
            </span>
          )}

          {/* Actions menu (admin only) */}
          {isAdmin && !isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-popover border-border z-50"
              >
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAddingSubfolder(true);
                    onFolderExpanded(folder);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Subcarpeta
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditName(folder.folderName);
                    setIsEditing(true);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Renombrar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteDialogOpen(true);
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Subfolder input */}
        {isAddingSubfolder && (
          <div
            className="flex items-center gap-2 py-1.5 px-2"
            style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
          >
            <Folder className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nombre de carpeta..."
              className="h-7 text-sm flex-1 bg-sidebar-accent border-sidebar-border"
              autoFocus
              onBlur={() => {
                setIsAddingSubfolder(false);
                setNewFolderName('');
              }}
              onKeyDown={handleAddSubfolder}
            />
          </div>
        )}

        {/* Children */}
        <CollapsibleContent>
          {folder.children.map((child) => (
            <FolderTreeItem
              activeFilter={activeFilter}
              folder={child}
              isExpanded={isExpanded}
              key={child.id}
              level={level + 1}
              onFolderClick={onFolderClick}
              onFolderExpanded={onFolderExpanded}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>

      <FolderDeleteDialog
        folderName={folder.folderName}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
