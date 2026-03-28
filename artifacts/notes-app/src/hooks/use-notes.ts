import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getNoteHistory, 
  getNoteById, 
  processNote,
  processNoteText,
  deleteNote,
  getGetNoteHistoryQueryKey,
  getGetNoteByIdQueryKey,
  type ProcessNoteRequest,
  type ProcessNoteTextRequest,
} from "@workspace/api-client-react";

export function useNotesHistory() {
  return useQuery({
    queryKey: getGetNoteHistoryQueryKey(),
    queryFn: () => getNoteHistory(),
  });
}

export function useNoteDetail(id: number) {
  return useQuery({
    queryKey: getGetNoteByIdQueryKey(id),
    queryFn: () => getNoteById(id),
    enabled: !!id,
  });
}

export function useProcessNoteMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ProcessNoteRequest) => processNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetNoteHistoryQueryKey() });
    },
  });
}

export function useProcessNoteTextMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProcessNoteTextRequest) => processNoteText(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetNoteHistoryQueryKey() });
    },
  });
}

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: getGetNoteHistoryQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetNoteByIdQueryKey(deletedId) });
    },
  });
}
