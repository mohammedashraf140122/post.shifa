import { QueryClient } from "@tanstack/react-query";

// Singleton QueryClient to be shared across the app and utilities
const queryClient = new QueryClient();

export default queryClient;


