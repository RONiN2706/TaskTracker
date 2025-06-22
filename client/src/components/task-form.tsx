import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema, type InsertTask } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Feather, Plus } from "lucide-react";

export default function TaskForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: undefined,
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: InsertTask) => {
      const response = await apiRequest("POST", "/api/tasks", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Task created",
        description: "Your task has been added to your diary.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTask) => {
    createTaskMutation.mutate(data);
  };

  return (
    <div className="theme-card-bg paper-texture rounded-lg shadow-diary-lg border border-theme-border p-6 mb-8">
      <h2 className="font-serif text-xl font-semibold theme-primary mb-6 border-b border-theme-secondary/50 pb-2">
        <Feather className="inline mr-2 theme-accent" size={20} />
        Add New Task
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Task Title */}
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block font-serif theme-primary font-medium">
                      Task Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What needs to be done?"
                        className="w-full px-4 py-3 rounded-lg border border-theme-border bg-theme-bg theme-text font-century focus:ring-2 focus:ring-theme-primary/30 focus:border-theme-primary shadow-inner-diary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Task Description */}
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block font-serif theme-primary font-medium">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional details..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-theme-secondary/50 bg-diary-cream/50 diary-text font-century focus:ring-2 focus:ring-theme-primary/30 focus:border-theme-primary shadow-inner-diary task-line resize-none"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Due Date */}
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block font-serif theme-primary font-medium">
                      Due Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="w-full px-4 py-3 rounded-lg border border-theme-border bg-theme-bg theme-text font-century focus:ring-2 focus:ring-theme-primary/30 focus:border-theme-primary shadow-inner-diary"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={createTaskMutation.isPending}
              className="bg-theme-primary text-diary-paper px-6 py-3 rounded-lg font-century font-semibold hover:bg-theme-primary/90 focus:ring-2 focus:ring-theme-primary/30 transform hover:scale-105 transition-all duration-200 shadow-diary"
            >
              <Plus className="mr-2" size={16} />
              {createTaskMutation.isPending ? "Adding..." : "Add Task"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
