import type { FC, SyntheticEvent } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import "./SearchField.css";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  placeholder?: string;
}

export const SearchField: FC<SearchFieldProps> = ({
  value,
  onChange,
  onSubmit,
  loading = false,
  placeholder = "Введите название соединения",
}) => {
  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="search-container">
      <Form onSubmit={handleSubmit} className="search-form-custom">
        <Form.Control
          type="text"
          className="search-input-custom"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button
          type="submit"
          variant="link"
          className="search-btn-custom"
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : <i className="fas fa-search"></i>}
        </Button>
      </Form>
    </div>
  );
};
