export function SanitizeCEP(cep: string) {
  return cep.replace(/[-_]/g, "");
}

export function SanitizeCPF(cpf: string) {
  return cpf.replace(/[._]/g, "");
}