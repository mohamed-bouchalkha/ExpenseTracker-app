import { createSelector, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { Budget } from "./Budget";
import { Category } from "./Category";
import { Expense } from "./Expense";
import { RootState } from "./store";

const todayDate = moment().format("YYYY-MM-DD");

interface initialStateProps {
  expenses: Expense[];
  todayTotal: number;
  topSpendingCategories: Category[];
  categories: Category[];
  budgets: Budget[];
}

const initialState: initialStateProps = {
  expenses: [],
  todayTotal: 0,
  topSpendingCategories: [],
  categories: [],
  budgets: [],
};

const expensesReducer = createSlice({
  name: "expenses",
  initialState: initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },

    addExpense: (state, action) => {
      state.expenses = [...state.expenses, action.payload];
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setTopSpedingCategories: (state, action) => {
      state.topSpendingCategories = action.payload;
    },
    setBudgets: (state, action) => {
      state.budgets = action.payload;
    },
    editBudgets: (state, action) => {
      let budgets = action.payload;

      state.budgets = state.budgets.map((budget) => {
        const budgetToEdit = budgets.find((item: Budget) => item.category === budget.category);

        if (budgetToEdit) {
          return {
            ...budget,
            budget: budgetToEdit.budget,
          };
        } else {
          return budget;
        }
      });

      let budgetsToAdd: Budget[] = budgets.filter((item: any) => {
        const existentBudget = state.budgets.find((budget) => budget.category === item.category);

        if (!existentBudget) {
          return true;
        } else {
          return false;
        }
      });

      if (budgetsToAdd && budgetsToAdd.length > 0) {
        state.budgets = [...state.budgets, ...budgetsToAdd];
      }
    },
  },
});

//actions
export const setExpensesAction = expensesReducer.actions.setExpenses;
export const addExpenseAction = expensesReducer.actions.addExpense;
export const setCategoriesAction = expensesReducer.actions.setCategories;
export const setBudgetsAction = expensesReducer.actions.setBudgets;
export const editBudgetsAction = expensesReducer.actions.editBudgets;

//selectors
const generalState = (state: RootState) => state.expenses;
const globalState = (state: RootState) => state;

export const todayTotalSelector = createSelector([generalState], (expenses: any) => {
  return expenses.expenses
    .filter((expense: Expense) => expense.payDate === todayDate)
    .reduce((accumulator: any, currentValue: Expense) => accumulator + currentValue.amount, 0);
});

export const monthTotalSelector = createSelector([globalState], (globalState: any) => {
  const currentMonth = globalState.user.month;
  const parsedMonth = moment(currentMonth, "MMMM");
  if (parsedMonth.isValid()) {
    const monthNumber = parsedMonth.month();
    const startOfMonth = moment().month(monthNumber).startOf("month").format("YYYY-MM-DD");
    const endOfMonth = moment().month(monthNumber).endOf("month").format("YYYY-MM-DD");
    return globalState.expenses.expenses
      .filter(
        (expense: Expense) => expense.payDate >= startOfMonth && expense.payDate <= endOfMonth
      )
      .reduce((accumulator: any, currentValue: Expense) => accumulator + currentValue.amount, 0);
  }
});

export const categoriesSelector = createSelector([generalState], (expenses: any) => {
  return expenses.categories;
});

export const topSpedingCategoriesSelector = createSelector([generalState], (expenses: any) => {
  const topSpendingCategories = expenses.expenses.reduce((accumulator: any, expense: any) => {
    const categoryName = expense.name;
    const existingCategory = accumulator.find((item: any) => item.name === categoryName);

    if (!existingCategory) {
      const { color, id } = expenses.categories.find(
        (item: Category) => item.name === categoryName
      );
      accumulator.push({
        name: categoryName,
        amount: expense.amount,
        color,
        id,
      });
    } else {
      existingCategory.amount += expense.amount;
    }

    return accumulator;
  }, []);

  return topSpendingCategories.sort((a: Category, b: Category) => b.amount! - a.amount!);
});

export const monthlyBudgetsSelector = createSelector([generalState], (expenses: any) => {
  return expenses.budgets;
});

export default expensesReducer.reducer;
