use anchor_lang::prelude::*;
use anchor_spl::{
    token::{self, Token},
    token_interface::{self, Burn, Mint, MintTo, TokenAccount, TokenInterface, TransferChecked},
};

declare_id!("8n6tXMhBaJ67C6nmWZ71e5voHnygzxLEHNenxVrrnbnm");

#[program]
pub mod escrow_contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, amount: u64) -> Result<()> {
        let escrow_state = &mut ctx.accounts.escrow_state_account;
        //update the account
        escrow_state.token_mint = ctx.accounts.token_mint.key();
        escrow_state.vault_address = ctx.accounts.token_vault.key();
        escrow_state.token_amount = amount;
        escrow_state.bump = ctx.bumps.token_vault;

        //transfer to vault
        ctx.accounts.main_transfer(amount)?;
        Ok(())
    }

    //p2p section
    pub fn p2pswap(ctx: Context<P2PTransfer>, input_amount: u64, output_amount: u64) -> Result<()> {
        ctx.accounts.main_transfer(input_amount, output_amount)?;
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct EscrowStateShape {
    //token mint
    pub token_mint: Pubkey,
    pub vault_address: Pubkey,
    pub token_amount: u64,
    pub bump: u8,
}

//the init function is mainly for the maker (seller)
//this function let's maker list itself
#[derive(Accounts)]
pub struct Initialize<'info> {
    //signer
    #[account(mut)]
    pub maker: Signer<'info>,

    //token mint
    pub token_mint: InterfaceAccount<'info, Mint>,

    //token_program
    pub token_program: Interface<'info, TokenInterface>,
    //system_program
    pub system_program: Program<'info, System>,

    //init function
    #[account(init, payer=maker, space = 8+EscrowStateShape::INIT_SPACE, seeds = [b"escrow_state_account", token_mint.key().as_ref()], bump)]
    pub escrow_state_account: Box<Account<'info, EscrowStateShape>>,

    //init function
    #[account(init,  payer= maker, token::mint = token_mint, token::authority = escrow_state_account, token::token_program = token_program, seeds = [b"token_vault", escrow_state_account.key().as_ref(), token_mint.key().as_ref()], bump )]
    pub token_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    //maker token account
    #[account(mut, token::authority = maker, token::mint = token_mint)]
    pub maker_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
}

#[error_code]
pub enum InitErrors {
    #[msg("insufficient balance in the account")]
    InsufficientBalance,
}

impl<'info> Initialize<'info> {
    fn main_transfer(&self, amount: u64) -> Result<()> {
        self.check(amount)?;
        self.transfer_to_vault(amount)?;

        Ok(())
    }

    fn check(&self, amount: u64) -> Result<()> {
        //check if the maker has the amount to deposit which they intend to do
        if self.maker_token_account.amount < amount {
            return err!(InitErrors::InsufficientBalance)?;
        }

        Ok(())
    }

    //transfer token
    fn transfer_to_vault(&self, amount: u64) -> Result<()> {
        let decimals = self.token_mint.decimals;
        let cpi_accounts = TransferChecked {
            mint: self.token_mint.to_account_info(),
            from: self.maker_token_account.to_account_info(),
            to: self.token_vault.to_account_info(),
            authority: self.maker.to_account_info(),
        };

        let cpi_program = self.token_program.to_account_info();
        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
        token_interface::transfer_checked(cpi_context, amount, decimals)?;
        Ok(())
    }
}

//the real transfer function
#[derive(Accounts)]
pub struct P2PTransfer<'info> {
    //maker and taker
    #[account(mut)]
    pub maker: Signer<'info>,

    //taker account
    #[account(mut)]
    pub taker: Signer<'info>,

    //token mint
    pub input_token_mint: Box<InterfaceAccount<'info, Mint>>,
    pub output_token_mint: Box<InterfaceAccount<'info, Mint>>,

    //token_program
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,

    //escrow state account
    #[account(mut,  seeds = [b"escrow_state_account", output_token_mint.key().as_ref()], bump)]
    pub escrow_state_account: Box<Account<'info, EscrowStateShape>>,

    //maker input account
    #[account(mut, token::mint = input_token_mint, token::authority = maker)]
    pub maker_input_account: Box<InterfaceAccount<'info, TokenAccount>>,

    //maker output account
    #[account(mut, token::mint = output_token_mint, token::authority = maker)]
    pub maker_output_account: Box<InterfaceAccount<'info, TokenAccount>>,

    //taker input account
    #[account(mut, token::mint = input_token_mint, token::authority = taker)]
    pub taker_input_account: Box<InterfaceAccount<'info, TokenAccount>>,

    //taker output account
    #[account(mut, token::mint = output_token_mint, token::authority = taker)]
    pub taker_output_account: Box<InterfaceAccount<'info, TokenAccount>>,

    //vault token account
    #[account(mut , token::mint= output_token_mint, token::authority = escrow_state_account)]
    pub vault_account: Box<InterfaceAccount<'info, TokenAccount>>,
}

#[error_code]
pub enum P2pError {
    #[msg("insufficient amount to swap")]
    InsufficientAmount,

    #[msg("incorrect input account")]
    IncorrectInputAccount,

    #[msg("incorrect output account ")]
    IncorrectOutputAccount,
}

impl<'info> P2PTransfer<'info> {
    fn main_transfer(&self, input_amount: u64, output_amount: u64) -> Result<()> {
        //transfer maker
        self.checks(input_amount)?;
        self.transfer_to_maker(input_amount)?;
        self.transfer_to_taker(output_amount)?;
        Ok(())
    }

    fn checks(&self, amount: u64) -> Result<()> {
        //check if the taker have the account
        if self.taker_input_account.amount < amount {
            return err!(P2pError::InsufficientAmount);
        }
        Ok(())
    }

    fn transfer_to_taker(&self, amount: u64) -> Result<()> {
        //transfer token from user account
        let decimals = self.output_token_mint.decimals;
        let cpi_accounts = TransferChecked {
            mint: self.output_token_mint.to_account_info(),
            from: self.vault_account.to_account_info(),
            to: self.taker_output_account.to_account_info(),
            authority: self.escrow_state_account.to_account_info(),
        };

        let cpi_program = self.token_program.to_account_info();

        let output_mint = self.output_token_mint.key();

        let seeds = [
            b"escrow_state_account",
            output_mint.as_ref(),
            &[self.escrow_state_account.bump],
        ];

        let signer_seeds = &[&seeds[..]];
        let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        token_interface::transfer_checked(cpi_context, amount, decimals)?;
        Ok(())
    }

    fn transfer_to_maker(&self, amount: u64) -> Result<()> {
        //take the amount from the taker acount to the maker account
        let decimals = self.input_token_mint.decimals;
        let cpi_accounts = TransferChecked {
            mint: self.input_token_mint.to_account_info(),
            from: self.taker_input_account.to_account_info(),
            to: self.maker_output_account.to_account_info(),
            authority: self.taker.to_account_info(),
        };

        let cpi_program = self.token_program.to_account_info();

        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
        token_interface::transfer_checked(cpi_context, amount, decimals)?;

        Ok(())
    }
}
