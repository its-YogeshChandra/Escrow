use anchor_lang::prelude::*;
use anchor_spl::{
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
    pub token_0_mint: Pubkey,
    pub token_1_mint: Pubkey,
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
    #[account(init, payer=signer, space = 8+EscrowStateShape::INIT_SPACE, seeds = [b"escrow_state_account", token_mint.key().as_ref()], bump)]
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
    pub token_0_mint: InterfaceAccount<'info, Mint>,
    pub token_1_mint: InterfaceAccount<'info, Mint>,

    //token_program
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,

    //maker input account
    #[account(mut, token::mint = token_0_mint, token::authority = maker)]
    pub maker_input_account: InterfaceAccount<'info, TokenAccount>,

    //maker output account
    #[account(mut, token::mint = token_1_mint, token::authority = maker)]
    pub maker_output_account: InterfaceAccount<'info, TokenAccount>,

    //token input account
    #[account(mut, token::mint = token_1_mint, token::authority = maker)]
    pub taker_input_account: InterfaceAccount<'info, TokenAccount>,

    //taker output account
    #[account(mut, token::mint = token_1_mint, token::authority = maker)]
    pub taker_output_account: InterfaceAccount<'info, TokenAccount>,
}

impl<'info> P2PTransfer<'info> {
    fn main_transfer(&self) {
        //transfer maker
        self.transfer_to_vault();
        self.transfer_to_taker();
        self.transfer_to_maker();
    }

    fn transfer_to_vault(&self) {}
    fn transfer_to_taker(&self) {}
    fn transfer_to_maker(&self) {}
}
