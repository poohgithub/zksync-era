import React from 'react';
import { Flex } from '@chakra-ui/react';
import TodoList from '../components/todo/TodoList';
import AddTodoForm from '../components/todo/AddTodoForm';

function TodoPage() {
  return (
    <Flex flexDirection="column" alignItems="center" pt={8}>
      <AddTodoForm />
      <TodoList />
    </Flex>
  );
}

export default TodoPage;
