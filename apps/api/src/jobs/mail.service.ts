import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('MAIL_HOST', 'localhost'),
      port: configService.get<number>('MAIL_PORT', 1025),
      auth: configService.get('MAIL_USER')
        ? {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASS'),
          }
        : undefined,
    });
  }

  async sendPrazoAlert(prazo: any, diasAntes: number) {
    const vencimento = new Date(prazo.dataVencimento).toLocaleDateString('pt-BR');
    const urgencia = diasAntes === 1 ? 'URGENTE - ' : '';

    await this.transporter.sendMail({
      from: this.configService.get('MAIL_FROM', 'noreply@lexmanager.local'),
      to: prazo.responsavel.email,
      subject: `${urgencia}Prazo vence em ${diasAntes} dia(s): ${prazo.titulo}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1e3a8a; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">LexManager Pro</h2>
            <p style="margin: 5px 0 0;">Alerta de Prazo</p>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <h3 style="color: ${diasAntes <= 3 ? '#dc2626' : '#d97706'};">
              ⚠️ Prazo vence em ${diasAntes} dia(s)
            </h3>
            <p><strong>Prazo:</strong> ${prazo.titulo}</p>
            ${prazo.descricao ? `<p><strong>Descrição:</strong> ${prazo.descricao}</p>` : ''}
            ${prazo.processo ? `<p><strong>Processo:</strong> ${prazo.processo.titulo}${prazo.processo.numeroCnj ? ` (${prazo.processo.numeroCnj})` : ''}</p>` : ''}
            <p><strong>Vencimento:</strong> ${vencimento}</p>
            <p><strong>Responsável:</strong> ${prazo.responsavel.nome}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="color: #6b7280; font-size: 14px;">
              Este é um alerta automático do LexManager Pro.
            </p>
          </div>
        </div>
      `,
    });
  }

  async sendWelcome(email: string, nome: string, nomeTenant: string) {
    await this.transporter.sendMail({
      from: this.configService.get('MAIL_FROM', 'noreply@lexmanager.local'),
      to: email,
      subject: `Bem-vindo ao LexManager Pro, ${nome}!`,
      html: `
        <p>Olá ${nome},</p>
        <p>Seu escritório <strong>${nomeTenant}</strong> foi cadastrado com sucesso no LexManager Pro.</p>
        <p>Acesse o sistema e comece a gerenciar seus processos de forma eficiente.</p>
      `,
    });
  }
}
