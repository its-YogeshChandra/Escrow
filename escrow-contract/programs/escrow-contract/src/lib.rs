use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Token},
    token_interface::{self, Burn, Mint, MintTo, TokenAccount, TokenInterface, TransferChecked},
};

declare_id!("8n6tXMhBaJ67C6nmWZ71e5voHnygzxLEHNenxVrrnbnm");

#[program]
pub mod escrow_contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct EscrowStateShape {}

#[derive(Accounts)]
pub struct Initialize<'info> {
    //signer
    #[account(mut)]
    pub signer: Signer<'info>,

    pub token_mint: InterfaceAccount<'info, Mint>,

    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,

    //init function
    #[account(init,  payer= signer, token::mint = token_mint, token::authority = escrow_state_account, token::token_program = token_program, seeds = [b"token_vault", escrow_state_account.key().as_ref(), token_mint.key().as_ref()], bump )]
    pub token_vault: InterfaceAccount<'info, TokenAccount>,

    //init function
    pub escrow_state_account: Account<'info, EscrowStateShape>,
}
