import {Role} from "@/types";

export function formatRoleLabel(role: Role) {
    return role.description || role.name.replace('ROLE_', '').replaceAll('_', ' ').toLowerCase();
}