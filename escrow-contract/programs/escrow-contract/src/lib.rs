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
pub struct EscrowStateShape {
    //token mint
    pub token_mint: Pubkey,
    pub vault_address: Pubkey,
    pub token_amount: Pubkey,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    //signer
    #[account(mut)]
    pub signer: Signer<'info>,

    //token mint
    pub token_mint: InterfaceAccount<'info, Mint>,

    //token_program
    pub token_program: Interface<'info, TokenInterface>,
    //system_program
    pub system_program: Program<'info, System>,

    //init function
    #[account(init,  payer= signer, token::mint = token_mint, token::authority = escrow_state_account, token::token_program = token_program, seeds = [b"token_vault", escrow_state_account.key().as_ref(), token_mint.key().as_ref()], bump )]
    pub token_vault: InterfaceAccount<'info, TokenAccount>,

    //init function
    #[account(init, payer=signer, space = 8+EscrowStateShape::INIT_SPACE, seeds = [b"escrow_state_account"], bump)]
    pub escrow_state_account: Account<'info, EscrowStateShape>,
}

#[derive(Accounts)]
pub struct P2PTransfer<'info> {
    //maker and taker
    #[account(mut)]
    pub maker: Signer<'info>,

    //taker account
    #[account(mut)]
    pub taker: Signer<'info>,

    //token mint
    pub token_mint: InterfaceAccount<'info, Mint>,

    //token_program
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Interface<'info, TokenInterface>,

    //maker input account
    pub maker_input_account: InterfaceAccount<'info, TokenAccount>,
    //main output account
    pub maker_output_account: InterfaceAccount<'info, TokenAccount>,

    //taker input account
    pub taker_input_account: InterfaceAccount<'info, TokenAccount>,
    //taker output account
    pub taker_output_account: InterfaceAccount<'info, TokenAccount>,
}
