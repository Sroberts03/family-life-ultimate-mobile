import { createContext, useContext, useEffect, useState } from "react";
import { TruncatedFamily } from "./family.types";
import { getAllFamilies } from "./services/family.services";
import { useAuth } from "../auth/AuthContext";

export interface FamilyContextType {
    memberFamilies: TruncatedFamily[]
    familyId: string
    familyLoading: boolean
    familyError: string
    setFamilyId: (familyId: string) => void
    setMemberFamilies: (memberFamilies: TruncatedFamily[]) => void
}

export const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export function FamilyProvider({ children }: { children: React.ReactNode }) {
    const { session } = useAuth();
    const [memberFamilies, setMemberFamilies] = useState<TruncatedFamily[]>([]);
    const [familyId, setFamilyId] = useState<string>("");
    const [familyLoading, setFamilyLoading] = useState(false);
    const [familyError, setFamilyError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (!session) return;
            setFamilyLoading(true);
            try {
                let memberFamilies = await getAllFamilies(session);
                setMemberFamilies(memberFamilies);
                if (memberFamilies.length > 0) {
                    setFamilyId(memberFamilies[0].familyId);
                }
            } catch (err) {
                setFamilyError(err instanceof Error ? err.message : "Failed to load families");
            } finally {
                setFamilyLoading(false);
            }
        };
        fetchData();
    }, [session]);

    return (
        <FamilyContext.Provider
            value={{
                memberFamilies,
                familyId,
                setFamilyId,
                setMemberFamilies,
                familyLoading,
                familyError
            }}>
            {children}
        </FamilyContext.Provider>
    );
}

export const useFamily = () => {
    const context = useContext(FamilyContext);
    if (context === undefined) {
        throw new Error("useFamily must be used within a FamilyProvider");
    }
    return context;
};